const db = require("../config/db");

class User {

    static create(name, email, password) {
        return db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, password]
        );
    }

    static findByEmail(email) {
        return db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        ).then(results => results[0]);
    }

}

module.exports = User;