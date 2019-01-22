"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var of_1 = require("rxjs/internal/observable/of");
var fs = require("fs");
var s3 = require("aws-sdk/clients/s3");
var client_1 = require("@slack/client");
var from_1 = require("rxjs/internal/observable/from");
var path = require("path");
var bindNodeCallback_1 = require("rxjs/internal/observable/bindNodeCallback");
var mime = require("mime");
var moment = require("moment");
var Deploy = /** @class */ (function () {
    function Deploy(options) {
        this.options = options;
        this.options.bundleAbsoluteFilePath = path.join(__dirname, this.options.bundleAbsoluteFilePath ? this.options.bundleAbsoluteFilePath : '../../../../dist');
    }
    Deploy.prototype.execute = function () {
        var _this = this;
        this.startDate = new Date();
        console.log('\x1b[33m%s\x1b[0m', '[Deploy-on-s3] Starting deployments..');
        console.log('\x1b[32m', "[Deploy-on-s3] " + moment(this.startDate).format('YYYY-MM-DD HH:mm:ss'));
        console.log('\x1b[32m', "[Deploy-on-s3] Find package.json ..");
        return this.getPackageJson(this.options.packageJsonPath ? this.options.packageJsonPath : '../../../../package.json').pipe(operators_1.concatMap(function (packageJson) {
            return _this.uploadToS3(_this.options.s3PublicKey, _this.options.s3SecretKey, _this.options.s3BucketName, packageJson)
                .pipe(operators_1.concatMap(function (hashKey) {
                console.log('\x1b[32m', "[Deploy-on-s3] Upload file(" + hashKey + ") on s3 ..");
                return of_1.of({ hashKey: hashKey, packageJson: packageJson });
            }));
        }), operators_1.concatMap(function (uploadTrans) {
            return _this.record(uploadTrans.hashKey, uploadTrans.packageJson).pipe(operators_1.concatMap(function (record) {
                return of_1.of(uploadTrans.packageJson);
            }));
        }), operators_1.last(), operators_1.concatMap(function (packageJson) {
            _this.endDate = new Date();
            if (_this.options.slackChannel) {
                console.log('\x1b[32m', '[Deploy-on-s3] Send slack notification');
                return _this.sendNotificationOnSlack(packageJson.name, packageJson.version, _this.options.slackChannel, _this.options.slackToken);
            }
            return of_1.of(true);
        }), operators_1.concatMap(function () {
            console.log('\x1b[36m%s\x1b[0m', '[Deploy-on-s3] Successfully deployed.');
            return of_1.of(true);
        }));
    };
    Deploy.prototype.getPackageJson = function (packageJsonPath) {
        return of_1.of(JSON.parse(fs.readFileSync(path.join(__dirname, packageJsonPath), 'utf8')));
    };
    Deploy.prototype.getBundleFiles = function (bundleFilePath) {
        var _this = this;
        return bindNodeCallback_1.bindNodeCallback(fs.readdir)(bundleFilePath).pipe(operators_1.map(function (fileNames) {
            return fileNames.map(function (fileName) {
                return {
                    fileName: fileName,
                    absoluteFileName: bundleFilePath + "/" + fileName,
                    buffer: fs.lstatSync(bundleFilePath + "/" + fileName).isDirectory() ? null : fs.readFileSync(bundleFilePath + "/" + fileName),
                    isDir: fs.lstatSync(bundleFilePath + "/" + fileName).isDirectory()
                };
            });
        }), operators_1.concatMap(function (files) {
            return of_1.of(files).pipe(operators_1.mergeMap(function (files) { return files; }), operators_1.concatMap(function (file) {
                return file.isDir ? _this.getBundleFiles(file.absoluteFileName) : of_1.of(file);
            }), operators_1.zip(), operators_1.mergeAll());
        }));
    };
    Deploy.prototype.uploadToS3 = function (accessKeyId, secretAccessKey, s3BucketName, packageJson) {
        var _this = this;
        return this.getBundleFiles(this.options.bundleAbsoluteFilePath).pipe(operators_1.concatMap(function (file) {
            return _this.generateHashKey(s3BucketName, packageJson.name, packageJson.version, file.fileName).pipe(operators_1.concatMap(function (hashKey) {
                return from_1.from(new s3({
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey
                }).putObject({
                    Bucket: s3BucketName,
                    Key: hashKey,
                    Body: file.buffer,
                    // ACL: 'public-read',
                    ContentType: mime.getType(file.fileName)
                }).promise()).pipe(operators_1.map(function () { return hashKey; }));
            }));
        }));
    };
    Deploy.prototype.generateHashKey = function (s3BucketName, packageName, version, fileName) {
        return of_1.of(s3BucketName + "/" + packageName + "-" + version + "/" + fileName);
    };
    Deploy.prototype.record = function (s3HashKey, packageJson) {
        return of_1.of({ id: 1 });
    };
    Deploy.prototype.sendNotificationOnSlack = function (name, version, channelName, token) {
        var web = new client_1.WebClient(token);
        var dateFormat = 'YYYY-MM-DD HH:mm:ss';
        return from_1.from(web.chat.postMessage({
            username: 'wall-e',
            channel: channelName,
            text: "Successfully deployed. [" + name + " (" + version + ")]\n\n\nStartTime: " + moment(this.startDate).format(dateFormat) + "\nEndTime: " + moment(this.endDate).format(dateFormat) + "\nDuration: " + moment(this.endDate).diff(moment(this.startDate), 'seconds') + " seconds",
            icon_url: 'https://avatars.slack-edge.com/2018-08-09/413597929477_aa61114005647f68d75f_48.jpg'
        })).pipe(operators_1.concatMap(function () { return of_1.of(true); }), operators_1.catchError(function () { return of_1.of(false); }));
    };
    return Deploy;
}());
exports.Deploy = Deploy;
//# sourceMappingURL=deploy.js.map