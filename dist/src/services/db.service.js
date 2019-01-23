"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var mysql = require("mysql");
var DbService = /** @class */ (function () {
    function DbService() {
    }
    DbService.prototype.connect = function (mysqlConfig) {
        return new rxjs_1.Observable(function (observer) {
            var connectConfig = {
                host: mysqlConfig.host,
                port: mysqlConfig.port,
                user: mysqlConfig.user,
                password: mysqlConfig.password,
                database: mysqlConfig.database,
                charset: mysqlConfig.charset
            };
            mysql.createConnection(connectConfig).connect(function (err) {
                if (err) {
                    return observer.error(new Error('Database does not exist'));
                }
                observer.next(mysql.createConnection(connectConfig));
            });
        });
    };
    return DbService;
}());
exports.DbService = DbService;
//# sourceMappingURL=db.service.js.map