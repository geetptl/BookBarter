const db = require("../db");

async function validateUserId(userId) {
    const result = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
    console.log(result);
    return result.rowCount != 0;
}

module.exports = {
    validateUserId,
};
