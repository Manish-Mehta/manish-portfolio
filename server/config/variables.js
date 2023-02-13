
module.exports = {
    env: process.env.ENV || "DEV",
    prodDebug: process.env.PROD_DEBUG || false,
    port: process.env.PORT || 5000,
    dbName: process.env.DB_NAME,
    dbUri: process.env.DB_URI
};