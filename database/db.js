const mysql = require("mysql8");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "rental_db_secure",
});

conn.connect((error) => {
  if (error) throw error;
  console.log("Database Connected");
});
module.exports = conn;
