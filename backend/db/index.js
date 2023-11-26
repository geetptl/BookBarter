const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.VERBOSE == 1) {
        console.log("executed query", {
            text,
            params,
            duration,
            rows: res.rowCount,
        });
    }
    return res;
};

module.exports = { query };
