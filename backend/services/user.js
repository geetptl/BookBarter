const db = require("../db");
const bcrypt = require('bcrypt');

async function validateUserId(userId) {
    const result = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
    return result.rowCount != 0;
}

// needs error handling for duplicate keys
async function create(user_id, password_hash, email, phone_number, first_name, last_name, latitude, longitude, is_auth) {

    try{
        const result = await db.query(
            'INSERT INTO users(user_id, password_hash, email, phone_number, first_name, last_name, latitude, longitude, is_auth) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [user_id, password_hash, email, phone_number, first_name, last_name, latitude, longitude, false]
        );
        return result.rows[0];

    }
    
    catch(error) {
        if (error.message.includes('duplicate key value violates unique constraint')) { 
            throw new Error('User with the same user_id, email or phone number already exists');
        } else {
            throw error;
        }
    }
}

async function login(user_id, password) {

    const result = await db.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
        // User not found
        return null;
    }
    const user = result.rows[0];

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (passwordMatch) {
        // Passwords match, user is authenticated
        return user;
    } else {
        // Passwords don't match
        return null;
    }
}


module.exports = {
    validateUserId, create, login
};
