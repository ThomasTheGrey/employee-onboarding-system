// PostgreSQL Pool importieren
const { Pool } = require("pg");


// DB Konfiguration importieren
const dbconfig =
    require("../config/dbconfig");



const pool =
    new Pool(dbconfig);
    
// Verbindung exportieren
module.exports = pool;