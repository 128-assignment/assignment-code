const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected.');

    db.query('CREATE DATABASE IF NOT EXISTS loginSystem', (err, result) => {
        if (err) throw err;
        console.log('Database created or already exists.');
        
        db.changeUser({ database: 'loginSystem' }, (err) => {
            if (err) throw err;

            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    date_of_birth DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            db.query(createUsersTable, (err, result) => {
                if (err) throw err;
                console.log('Users table created or exists.');
            });

            const createCompaniesTable = `
                CREATE TABLE IF NOT EXISTS companies (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    company_name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    phone VARCHAR(50),
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            db.query(createCompaniesTable, (err, result) => {
                if (err) throw err;
                console.log('Companies table created or exists.');
            });
        });
    });
});
