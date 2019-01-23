"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deploy_1 = require("./src/deploy");
var db_service_1 = require("./src/services/db.service");
new deploy_1.Deploy({
    deploy: {
        s3PublicKey: '',
        s3SecretKey: '',
        s3BucketName: '',
        slackChannel: '',
        slackToken: '',
        packageJsonPath: '',
        bundleAbsoluteFilePath: ''
    },
    database: {
        host: '',
        port: 1,
        user: '',
        password: '',
        database: '',
        charset: '',
        column: ''
    }
}, new db_service_1.DbService())
    .execute()
    .subscribe();
//# sourceMappingURL=index.js.map