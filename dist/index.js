"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deploy_1 = require("./src/deploy");
var db_service_1 = require("./src/services/db.service");
if (process.argv.includes('--init')) {
    deploy_1.Deploy.init();
}
if (process.argv.includes('--execute')) {
    new deploy_1.Deploy(deploy_1.Deploy.getConfig(), new db_service_1.DbService())
        .execute()
        .subscribe();
}
//# sourceMappingURL=index.js.map