const config = require("config");
const mysql = require("mysql2");

module.exports = function createPool() {
  try {
    const pool = mysql.createPool(config.get("remotePoolConnection"));
    console.log("Connected to database..");

    const poolPromise = pool.promise();
    global.db = poolPromise;
  } catch (err) {
    console.log("Failed to connect to database..", err.message);
  }
};
