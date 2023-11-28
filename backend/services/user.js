const db = require("../db");
const bcrypt = require("bcrypt");

async function validateUserId(userId) {
    const result = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
    return result.rowCount != 0;
}

// needs error handling for duplicate keys
async function create(
    user_id,
    password_hash,
    email,
    phone_number,
    first_name,
    last_name,
    latitude,
    longitude,
    is_auth,
) {
    try {
        const result = await db.query(
            "INSERT INTO users(user_id, password_hash, email, phone_number, first_name, last_name, latitude, longitude, is_auth) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [
                user_id,
                password_hash,
                email,
                phone_number,
                first_name,
                last_name,
                latitude,
                longitude,
                false,
            ],
        );
        return result.rows[0];
    } catch (error) {
        if (
            error.message.includes(
                "duplicate key value violates unique constraint",
            )
        ) {
            throw new Error(
                "User with the same user_id, email or phone number already exists",
            );
        } else {
            throw error;
        }
    }
}
async function updateUserInfo(user_id, email, phone_number, first_name, last_name, latitude, longitude, is_auth,original_user_id) {
    try {
        // Check if the new email or phone number already exists in the database for other users.
        const checkDuplicateQuery = `
            SELECT user_id
            FROM users
            WHERE (email = $1 OR phone_number = $2) AND user_id != $3
        `;

        const duplicateCheckResult = await db.query(checkDuplicateQuery, [email, phone_number, user_id]);

        if (duplicateCheckResult.rows.length > 0) {
            throw new Error('Duplicate email or phone number found');
        }

        // Update the user's information.  
        const updateQuery = `
        UPDATE users
        SET
            email = COALESCE($1, email),
            phone_number = COALESCE($2, phone_number),
            first_name = COALESCE($3, first_name),
            last_name = COALESCE($4, last_name),
            latitude = COALESCE($5, latitude),
            longitude = COALESCE($6, longitude),
            is_auth = COALESCE($7, is_auth),
            last_updated_on = current_timestamp
        WHERE user_id = $8
        RETURNING *
        `;

        const result = await db.query(updateQuery, [email, phone_number, first_name, last_name, latitude, longitude, is_auth, user_id]);
        console.log("Result is"+result.email);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    } catch (error) {
        throw error;
    }
}


async function login(user_id, password) {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [
        user_id,
    ]);
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

async function getUsername(id) {

    const result = await db.query('SELECT user_id FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
        // User not found
        return null;
    }
    const user = result.rows[0];
    return user;
}

async function getUserInfo(){
    const query = `SELECT id,created_on,last_updated_on,user_id,email,phone_number,first_name,last_name,latitude,longitude,is_auth,is_admin from users`;      
    const result = await db.query(query);
    if (result.rows.length === 0) {
        //  No users found
        return null;
    }
    return result;
}

async function getRequestInfo(){
    const query = `SELECT * FROM REQUEST`;      
    const result = await db.query(query);
    if (result.rows.length === 0) {
        //  No users found
        return null;
    }
    return result;  
}
  
async function getUserIdfromEmail(email) {

    const result = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    console.log(result)
    if (result.rows.length === 0) {
        // User not found
        return null;
    }
    const user_id = result.rows[0].id;
    console.log(user_id)
    return user_id;
}
async function getUserFirstName(id) {

    const result = await db.query('SELECT first_name FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
        // User not found
        return null;
    }
    const user = result.rows[0];
    return user;
}

async function deleteUserById(id) {
    try {
        const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
        console.log("Successfully Deleted user ", id);
        return result;
    } catch(error) {
        console.log("Error while performing delete operation on ", id)
    }
}

module.exports = {
    validateUserId, create, login, updateUserInfo,getUserIdfromEmail, getUsername, getUserFirstName, getUserInfo, getRequestInfo, deleteUserById
};
