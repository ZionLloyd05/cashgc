"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("./database");
const config_1 = require("./config");
const paypal = require("paypal-rest-sdk");
const internetAvailable = require("internet-available");
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Database configuration
         */
        database_1.DatabaseProvider.configure({
            type: 'mysql',
            database: config_1.default.database,
            username: config_1.default.username,
            password: config_1.default.password,
            host: config_1.default.host,
            port: config_1.default.dbport,
        });
        /**
         * PayPal configuration
         */
        paypal.configure({
            mode: config_1.default.mode,
            client_id: config_1.default.client_id,
            client_secret: config_1.default.client_secret,
        });
        const app = require('./config/viewsetup').default();
        yield require('./server').default({ app });
        app.listen(config_1.default.port, (err) => {
            if (err) {
                console.log('got an error');
                console.log(err);
                process.exit(1);
                return;
            }
            console.log('-------------------------------------------------------');
            console.log(' ( :  Server listening on port: ', config_1.default.port, ' : ) ');
            console.log('-------------------------------------------------------');
        });
        try {
            yield database_1.DatabaseProvider.getConnection();
            console.log('Database connected');
        }
        catch (error) {
            console.log('error');
            console.log(error);
        }
        internetAvailable({
            timeout: 4000,
            retries: 10,
        })
            .then(() => {
            console.log('Internet available');
        })
            .catch(() => {
            console.log('No internet');
        });
    });
}
startServer();
//# sourceMappingURL=app.js.map