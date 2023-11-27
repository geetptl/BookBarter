const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const initializeDatabase = (dbPath, ddlScripts) => {
    const dbExists = fs.existsSync(dbPath);
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(err.message);
            throw err;
        } else {
            console.log('Connected to the SQLite database.');
            if (!dbExists) {
                console.log('Creating new database schema...');
                ddlScripts.split(",").map(async scriptPath => {
                    console.log("Processing", scriptPath);
                    const ddlScript = fs.readFileSync(scriptPath, 'utf-8');
                    db.exec(ddlScript, (err) => {
                        if (err) {
                            console.error(err.message);
                            throw err;
                        } else {
                            console.log("File", scriptPath, "run successful!");
                        }
                    });
                })
            }
        }
    });

    return db;
};

// Initialize the database
const db = initializeDatabase(process.env.SQLITE_DB_PATH, process.env.SQLITE_DB_INIT_FILES);

const query = async (text, params) => {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        db.all(text, params, (err, rows) => {
            const duration = Date.now() - start;
            if (err) {
                reject(err);
            } else {
                if (process.env.VERBOSE == 1) {
                    console.log('Executed query', {
                        text,
                        params,
                        duration,
                        rows: rows.length,
                    });
                }
                resolve(rows);
            }
        });
    });
};

module.exports = {
    query
};
