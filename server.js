const express = require("express");
const server = express();
const port = 5000;
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

// Static files
server.use('/public', express.static(__dirname + '/public/'));
// Set EJS as the templating engine
server.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }))

// Starting a new database
const election_db = new sqlite3.Database('./election.db');

// Database section
// Initialize Database Tables
function initializeDatabase() {
    election_db.serialize(() => {
        const tables = [
            `CREATE TABLE IF NOT EXISTS votes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                candidate_id TEXT NOT NULL,
                vote INTEGER
            )`,
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstname TEXT NOT NULL,
                middlename TEXT,
                lastname TEXT NOT NULL,
                DOB DATE NOT NULL,
                role_id TEXT NOT NULL,
                photo TEXT NOT NULL,
                party_id TEXT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS parties (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                party TEXT NOT NULL,
                logo BLOB NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS positions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                position TEXT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS candidates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstname TEXT NOT NULL,
                middlename TEXT,
                lastname TEXT NOT NULL,
                position_id TEXT NOT NULL,
                party_id TEXT NOT NULL,
                photo BLOB NOT NULL,
                votes_id TEXT NOT NULL,
                candidate_id TEXT NOT NULL,
                vote INTEGER
            )`,
            `CREATE TABLE IF NOT EXISTS auth (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                auth_token TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )`
        ];

        tables.forEach(query => {
            election_db.run(query, (err) => {
                if (err) {
                    console.error(err.message);
                }
            });
        });
    });
}

// Initialize database
initializeDatabase();


// Server Runtime Section
server.get('/', (req, res) => {
    res.render(__dirname + '/views/' + 'registration');
})
server.get('/registration', (req, res) => {
    res.render(__dirname + '/views/' + 'registration');
})

server.post('/registration', (req, res) => {
    res.render(__dirname + '/views/' + 'login');
})

server.listen(port, () => {
    console.log(`Server is on at port ${port}.`);
})