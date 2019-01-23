export interface DeployOptionsInterface {
    s3PublicKey: string;
    s3SecretKey: string;
    s3BucketName: string;
    slackBotName?: string;
    slackChannel?: string;
    slackToken?: string;
    database?: {
        id: string;
        name?: string;
        password: string;
        host: string;
    };
    packageJsonPath?: string;
    bundleAbsoluteFilePath?: string;
}
