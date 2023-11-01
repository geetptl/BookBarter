const db = require('../db'); // Assuming you have a database connection module

const createUser = async (req, res) => {
  const { user_id, password_hash, email, phone_number, first_name, last_name, latitude, longitude, is_auth } = req.body;

  const result = await db.query(
    'INSERT INTO users(user_id, password_hash, email, phone_number, first_name, last_name, latitude, longitude, is_auth) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [user_id, password_hash, email, phone_number, first_name, last_name, latitude, longitude, is_auth]
  );
  result.rows[0];
  res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
};


module.exports = { createUser };
