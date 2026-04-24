const mysql = require("mysql2");

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "rijschool"
        });

        this.connection.connect(err => {
            if (err) throw err;
            console.log("MySQL connected");
        });
    }

    query(sql, params) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = new Database();