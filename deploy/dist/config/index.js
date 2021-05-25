"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv.config();
if (!envFound) {
    throw new Error("Couldn't find .env file");
}
exports.default = {
    /**
     * Database port number
     */
    dbport: parseInt(process.env.DBPORT, 10),
    /**
     * Database port number
     */
    port: parseInt(process.env.PORT, 10),
    /**
     * YDatabase type
     */
    type: process.env.TYPE,
    /**
     * Database host
     */
    host: process.env.HOST,
    /**
     * Database username
     */
    username: process.env.UNAME,
    /**
     * Database password
     */
    password: process.env.PASSWORD,
    /**
     * Database title
     */
    database: process.env.DATABASE,
    /**
     * Cipher Key
     */
    key: process.env.KEY,
    /**
     * Secret Key
     */
    secret: process.env.SECRET,
    /**
     * Environment
     */
    environment: process.env.ENVIR,
    /**
     * Routes Config
     */
    route: {
        prefix: '/',
    },
    /**
     * Cloudinary Configs
     */
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    /**
     * Paypal Config
     */
    mode: process.env.MODE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    /**
     * Payment Vendor Config
     */
    secret_key: process.env.SECRET_KEY,
    server_host: process.env.SERVER_HOST,
    /**
     * Postmark token
     */
    postmark_token: process.env.POSTMARKTOKEN,
};
//# sourceMappingURL=index.js.map