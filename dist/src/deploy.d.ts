import { Observable } from 'rxjs/internal/Observable';
import { PackageJsonInterface } from './interfaces/package-json.interface';
import { DeployOptionsInterface } from './interfaces/deploy-options.interface';
export declare class Deploy {
    options: DeployOptionsInterface;
    startDate: Date | null;
    endDate: Date | null;
    constructor(options: DeployOptionsInterface);
    execute(): Observable<boolean>;
    getPackageJson(packageJsonPath: string): Observable<PackageJsonInterface>;
    getBundleFiles(bundleFilePath: string): Observable<any>;
    uploadToS3(accessKeyId: string, secretAccessKey: string, s3BucketName: string, packageJson: PackageJsonInterface): Observable<any>;
    generateHashKey(s3BucketName: string, packageName: string, version: string, fileName: string): Observable<string>;
    record(s3HashKey: string, packageJson: PackageJsonInterface): Observable<{
        id: number;
    }>;
    sendNotificationOnSlack(name: string, version: string, channelName: string, token: string): Observable<boolean>;
}
