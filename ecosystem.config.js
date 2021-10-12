module.exports = {
  apps: [
    {
      name: 'cashgiftcode',
      exec_mode: 'cluster',
      instances: '1',
      script: 'dist/app.js', // your script
      args: 'start',
      env: {
        NODE_ENV: 'production',
        ENVIR: 'production',
        TYPE: 'mysql',
        HOST: 'MYSQL5035.site4now.net',
        DBPORT: '3306',
        UNAME: 'db_9d9472_cash',
        PASSWORD: 'gccode123**',
        DATABASE: 'db_9d9472_gccode',
        SERVER_HOST: 'http://localhost:7000',
        PORT: '7000',
        KEY: 'connect_dd',
        SECRET: 'dksjwerweii090wekrnjksdoijisjd09skkml',
        CLOUD_NAME: 'zionlloyd',
        API_KEY: '432858741981615',
        API_SECRET: '7anDqebobntOE90W1n5oQm0qJ5s',
        MODE: 'live',
        SECRET_KEY: 'FLWSECK-5a16ca2fc0c13a1325c9fe423466e85c-X',
        POSTMARKTOKEN: '4181dd98-f429-448e-9be6-a419a64eafa3',
      },
    },
  ],
};
