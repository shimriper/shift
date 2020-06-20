const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)

// Export config object
module.exports = {
    uri: "mongodb://shift:!QAZ2wsx@ds048279.mlab.com:48279/shifts2020", // Databse URI and database name
    secret: crypto, // Cryto-created secret
    db: 'shifts2020' // Database name
}