import * as dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  throw new Error("Couldn't find .env file");
}

export default {
  /**
   * Database port number
   */
  dbport: parseInt('3306', 10),
  /**
   * Database port number
   */
  port: parseInt('4000', 10),
  /**
   * YDatabase type
   */
  type: 'mysql',
  /**
   * Database host
   */
  host: 'MYSQL5035.site4now.net',
  /**
   * Database username
   */
  username: 'db_9d9472_cash',
  /**
   * Database password
   */
  password: 'gccode123**',
  /**
   * Database title
   */
  database: 'db_9d9472_gccode',
  /**
   * Cipher Key
   */
  key: 'connect_dd',
  /**
   * Secret Key
   */
  secret: 'dksjwerweii090wekrnjksdoijisjd09skkml',
  /**
   * Environment
   */
  environment: 'production',
  /**
   * Routes Config
   */
  route: {
    prefix: '/',
  },
  /**
   * Cloudinary Configs
   */
  cloudName: 'zionlloyd',
  apiKey: '432858741981615',
  apiSecret: '7anDqebobntOE90W1n5oQm0qJ5s',

  /**
   * Payment Vendor Config
   */
  secret_key: 'FLWSECK-5a16ca2fc0c13a1325c9fe423466e85c-X',
  server_host: 'cashgiftcode.23ems.com',
  mode: 'live',
};
