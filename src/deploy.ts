import {Observable} from 'rxjs/internal/Observable';
import {PackageJsonInterface} from './interfaces/package-json.interface';
import {DeployOptionsInterface} from './interfaces/deploy-options.interface';
import {catchError, concatMap, filter, last, map, mergeAll, mergeMap, retryWhen, tap, zip} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import * as fs from 'fs';
import * as s3 from 'aws-sdk/clients/s3';
import {IncomingWebhook, WebClient} from '@slack/client';
import * as mysql from 'mysql';
import {from} from 'rxjs/internal/observable/from';
import * as path from 'path';
import {bindNodeCallback} from 'rxjs/internal/observable/bindNodeCallback';
import {BundleInterface} from './interfaces/bundle.interface';
import * as mime from 'mime';
import * as moment from 'moment';

export class Deploy {
  public options: DeployOptionsInterface;
  public startDate: Date | null;
  public endDate: Date | null;

  public constructor(options: DeployOptionsInterface) {
    this.options = options;
    this.options.bundleAbsoluteFilePath = path.join(__dirname, this.options.bundleAbsoluteFilePath ? this.options.bundleAbsoluteFilePath : '../../../../dist');
  }

  public execute(): Observable<boolean> {
    this.startDate = new Date();
    console.log('\x1b[33m%s\x1b[0m', '[Deploy-on-s3] Starting deployments..');
    console.log('\x1b[32m', `[Deploy-on-s3] ${moment(this.startDate).format('YYYY-MM-DD HH:mm:ss')}`);
    console.log('\x1b[32m', `[Deploy-on-s3] Find package.json ..`);
    return this.getPackageJson(this.options.packageJsonPath ? this.options.packageJsonPath : '../../../../package.json').pipe(
      concatMap((packageJson: PackageJsonInterface) => {
        return this.uploadToS3(this.options.s3PublicKey, this.options.s3SecretKey, this.options.s3BucketName, packageJson)
          .pipe(
            concatMap((hashKey: string) => {
              console.log('\x1b[32m', `[Deploy-on-s3] Upload file(${hashKey}) on s3 ..`);
              return of({hashKey, packageJson})
            })
          )
      }),
      concatMap((uploadTrans: { hashKey: string; packageJson: PackageJsonInterface }) => {
        return this.record(uploadTrans.hashKey, uploadTrans.packageJson).pipe(
          concatMap(
            (record: { id: number }) => {
              return of(uploadTrans.packageJson)
            }
          )
        )
      }),
      last(),
      concatMap((packageJson: PackageJsonInterface) => {
        this.endDate = new Date();
        if (this.options.slackChannel) {
          console.log('\x1b[32m', '[Deploy-on-s3] Send slack notification');
          return this.sendNotificationOnSlack(packageJson.name, packageJson.version, this.options.slackChannel, this.options.slackToken)
        }
        return of(true)
      }),
      concatMap(() => {
        console.log('\x1b[36m%s\x1b[0m', '[Deploy-on-s3] Successfully deployed.');
        return of(true);
      })
    )
  }

  public getPackageJson(
    packageJsonPath: string
  ): Observable<PackageJsonInterface> {
    return of(JSON.parse(fs.readFileSync(path.join(__dirname, packageJsonPath), 'utf8')));
  }

  public getBundleFiles(bundleFilePath: string): Observable<any> {
    return bindNodeCallback(fs.readdir)(bundleFilePath).pipe(
      map((fileNames: string[]) => {
        return fileNames.map(fileName => {
          return {
            fileName,
            absoluteFileName: `${bundleFilePath}/${fileName}`,
            buffer: fs.lstatSync(`${bundleFilePath}/${fileName}`).isDirectory() ? null : fs.readFileSync(`${bundleFilePath}/${fileName}`),
            isDir: fs.lstatSync(`${bundleFilePath}/${fileName}`).isDirectory()
          }
        })
      }),
      concatMap((files: BundleInterface[]) => {
        return of(files).pipe(
          mergeMap(files => files),
          concatMap(file => {
            return file.isDir ? this.getBundleFiles(file.absoluteFileName) : of(file);
          }),
          zip(),
          mergeAll()
        );
      })
    )
  }

  public uploadToS3(
    accessKeyId: string,
    secretAccessKey: string,
    s3BucketName: string,
    packageJson: PackageJsonInterface
  ): Observable<any> {
    return this.getBundleFiles(this.options.bundleAbsoluteFilePath).pipe(
      concatMap((file: BundleInterface) => {
        return this.generateHashKey(s3BucketName, packageJson.name, packageJson.version, file.fileName).pipe(concatMap((hashKey) => {
          return from(new s3({
            accessKeyId,
            secretAccessKey
          }).putObject({
            Bucket: s3BucketName,
            Key: hashKey,
            Body: file.buffer,
            // ACL: 'public-read',
            ContentType: mime.getType(file.fileName)
          }).promise()).pipe(
            map(() => hashKey)
          )
        }))
      }),
    );
  }

  public generateHashKey(s3BucketName: string, packageName: string, version: string, fileName: string): Observable<string> {
    return of(`${s3BucketName}/${packageName}-${version}/${fileName}`);
  }

  public record(
    s3HashKey: string,
    packageJson: PackageJsonInterface
  ): Observable<{ id: number }> {
    return of({id: 1})
  }

  public sendNotificationOnSlack(name: string, version: string, channelName: string, token: string): Observable<boolean> {
    const web = new WebClient(token);
    const dateFormat: string = 'YYYY-MM-DD HH:mm:ss';
    return from(web.chat.postMessage({
      username: 'wall-e',
      channel: channelName,
      text: `Successfully deployed. [${name} (${version})]\n\n\nStartTime: ${moment(this.startDate).format(dateFormat)}\nEndTime: ${moment(this.endDate).format(dateFormat)}\nDuration: ${moment(this.endDate).diff(moment(this.startDate), 'seconds')} seconds`,
      icon_url: 'https://avatars.slack-edge.com/2018-08-09/413597929477_aa61114005647f68d75f_48.jpg'
    })).pipe(concatMap(() => of(true)), catchError(() => of(false)));
  }
}