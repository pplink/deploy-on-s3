"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var from_1 = require("rxjs/internal/observable/from");
var DbService = /** @class */ (function () {
    function DbService() {
    }
    DbService.prototype.connect = function () {
        return from_1.from(mysql.createConnection({
            host: '',
            user: '',
            password: '',
            database: ''
        }));
    };
    return DbService;
}());
exports.DbService = DbService;
//# sourceMappingURL=db.service.js.map