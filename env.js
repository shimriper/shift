const fs = require('fs');

if (fs.existsSync('./public')) {
    process.env.JWT = 'secret_this_should_be_longer'
    process.env.NODE_ENV = 'production';
    process.env.databaseUri = 'mongodb://shift:!QAZ2wsx@ds048279.mlab.com:48279/shifts2020'; // Databse URI and database name
    process.env.databaseName = 'production database: shifts2020'; // Database name
    process.env.GMAIL_USER = "shiftboishift@gmail.com";
    process.env.GMAIL_PWS = "Cbehartk1!";
    process.env.apiKey = '37237b83';
} else {
    process.env.JWT = 'secret_this_should_be_longer'
    process.env.NODE_ENV = 'development';
    process.env.databaseUri = 'mongodb://localhost:27017/mish_req'; // Databse URI and database name
    // process.env.databaseUri = 'mongodb://shift:!QAZ2wsx@ds048279.mlab.com:48279/shifts2020'; // Databse URI and database name
    process.env.databaseName = 'development database: mish_req'; // Database name
    process.env.GMAIL_USER = "shiftboishift@gmail.com";
    process.env.GMAIL_PWS = "Cbehartk1!";
    process.env.apiKey = '37237b83';
    process.env.apiSecret = 'sWX1nJYo5m8TX2pg';


}