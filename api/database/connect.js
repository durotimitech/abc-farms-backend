const mysql = require("mysql");

const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL)

// const pool = () => {
//   return mysql.createPool({
//     connectionLimit: 10,
//     ...process.env.CLEARDB_DATABASE_URL,
//   });
// };

// const db = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

// db.connect((e) => {
//   if (e) throw e;
//   console.log("MySql connected");
// });

// module.exports = db;
module.exports = pool;
