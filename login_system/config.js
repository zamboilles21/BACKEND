require('dotenv').config();

let dbconfig = {
    connectionLimit: process.env.DBLIMIT,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
}

let appconfig = {
    port: process.env.PORT
}

module.exports = { dbconfig, appconfig }