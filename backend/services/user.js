const db = require("../db");

async function validateUserId(userId) {
    const result = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
    return result.rowCount != 0;
}

// needs error handling for duplicate keys
async function create(userData) {
    const result = await db.query(
        'INSERT INTO users(user_id, password_hash, email, phone_number, first_name, last_name, latitude, longitude, is_auth) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [userData.user_id, userData.password_hash, userData.email, userData.phone_number, userData.first_name, userData.last_name, userData.latitude, userData.longitude, false]
    );
    return result.rows[0];
}

module.exports = {
    validateUserId, create
};
