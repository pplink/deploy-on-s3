"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deploy_1 = require("./src/deploy");
new deploy_1.Deploy({
    s3PublicKey: '',
    s3SecretKey: '',
    s3BucketName: '',
    slackChannel: '',
    slackToken: '',
    packageJsonPath: '',
    bundleAbsoluteFilePath: ''
}).execute().subscribe();
//# sourceMappingURL=index.js.map