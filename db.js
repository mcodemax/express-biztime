/** Database setup for BizTime. */
const { Client } = require("pg"); //destructuring

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql://postgres:myPassword@localhost:5433/biztime_test";
} else {
  DB_URI = "postgresql://postgres:myPassword@localhost:5433/biztime";
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;
