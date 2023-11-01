const { Pool } = require("pg");

// const pool = new Pool();
const pool = new Pool({
    user: "bookbarter_user",
    host: "localhost",
    database: "bookbarter_db",
    password: "bookbarter_pass",
    port: 5432,
  });

const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", { text, duration, rows: res.rowCount });
    return res;
};

module.exports = { query };
