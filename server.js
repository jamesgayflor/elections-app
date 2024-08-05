const express = require("express");
const server = express();
const port = 5000;
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');

// Static files
server.use('/public', express.static(__dirname + '/public/'));
// Set EJS as the templating engine
server.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }))

// Starting a new database
const election_db = new sqlite3.Database('./election.db');
// Setup storage for storing files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Database section
// Initialize Database Tables
function initializeDatabase() {
    election_db.serialize(() => {
        const tables = [
            `CREATE TABLE IF NOT EXISTS roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS votes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                candidate_id TEXT NOT NULL,
                votes INTEGER
            )`,
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstname TEXT NOT NULL,
                middlename TEXT,
                lastname TEXT NOT NULL,
                DOB DATE NOT NULL,
                photo BLOB NOT NULL
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
                photo BLOB NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS auth (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                username TEXT NOT NULL,
                password TEXT NOT NULL
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

    // Pulling Roles Information from database
    election_db.all(`SELECT * FROM roles`, [], (err, row) => {
        if (err) {
            throw err;
        }
        const registration_roles = row;
        res.render('registration', { registration_roles });
    });
})

server.get('/registration', (req, res) => {
    res.render('registration');
})

server.post('/registration', upload.fields([{ name: 'photo', maxCount: 1 }]), (req, res) => {

    // Save uploaded files
    const files = req.files;
    // console.log(req.files);

    if (files && files.photo) {

        // Save preference file
        const file = files.photo[0];

        // Prepare SQL insert statement
        const insert_stmt = election_db.prepare(`INSERT INTO users(firstname, middlename, lastname, DOB, photo) VALUES(?, ?, ?, ?, ?)`);

        const get_userid_stmt = election_db.prepare(`INSERT INTO auth(user_id, username, password) VALUES(?, ?, ?)`);

        let user_role_id;

        const user_role_selection = req.body.role;
        if (user_role_selection == 'admin') {
            user_role_id = 1;
        }
        else if (user_role_selection == 'voter') {
            user_role_id = 2;
        }
        else if (user_role_selection == 'candidate') {
            user_role_id = 3;
        }

        const strings_data = {
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            dob: req.body.dob,
            username: req.body.username,
            password: req.body.password,
            user_role: user_role_id
        }

        console.log(user_role_selection);
        console.log(user_role_id);

        // Execute SQL insert statement
        insert_stmt.run(strings_data.firstname, strings_data.middlename, strings_data.lastname, strings_data.dob, file.buffer, function (err) {
            if (err) {
                console.log(err.message)
            }
            else {
                const userid = this.lastID;
                // Execute get get_user_id_stmt SQL insert statement
                get_userid_stmt.run(userid, strings_data.username, strings_data.password, function (autherr) {
                    if (autherr) {
                        console.log(autherr.message);
                    }
                })
                res.render('login');
            }
        });
    }
    else {
        console.log("No file was uploaded!")
    }
})
// ----------------------------------------------------
server.listen(port, () => {
    console.log(`Server is on at port ${port}.`);
})