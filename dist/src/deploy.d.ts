import { Observable } from 'rxjs/internal/Observable';
import { PackageJsonInterface } from './interfaces/package-json.interface';
import { DeployOptionsInterface } from './interfaces/deploy-options.interface';
import { BundleInterface } from './interfaces/bundle.interface';
import { DatabaseConfigInterface } from './interfaces/database-config.interface';
import { DbService } from './services/db.service';
export declare class Deploy {
    DbService: DbService;
    options: DeployOptionsInterface;
    databaseOptions: DatabaseConfigInterface | null;
    startDate: Date | null;
    endDate: Date | null;
    constructor(options: {
        deploy: DeployOptionsInterface;
        database?: DatabaseConfigInterface;
    }, DbService: DbService);
    execute(): Observable<boolean>;
    getPackageJson(packageJsonPath: string): Observable<PackageJsonInterface>;
    getBundleFiles(bundleFilePath: string): Observable<BundleInterface>;
    uploadToS3(accessKeyId: string, secretAccessKey: string, s3BucketName: string, packageJson: PackageJsonInterface): Observable<string>;
    generateHashKey(s3BucketName: string, packageName: string, version: string, fileName: string): Observable<string>;
    record(s3HashKey: string, packageJson: PackageJsonInterface, databaseOptions: DatabaseConfigInterface): Observable<{
        id: number;
        count: number;
    }>;
    sendNotificationOnSlack(name: string, version: string, channelName: string, token: string, count: number): Observable<boolean>;
}
