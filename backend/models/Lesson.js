const db = require("../config/db");

class Lesson {

    static async getByUser(userId) {
        return await db.query(
            "SELECT * FROM lessons WHERE user_id = ?",
            [userId]
        );
    }

    static async create(userId, date, time) {
        return await db.query(
            "INSERT INTO lessons (user_id, date, time) VALUES (?, ?, ?)",
            [userId, date, time]
        );
    }

    static async cancel(id, userId) {
        return await db.query(
            "UPDATE lessons SET status = 'cancelled' WHERE id = ? AND user_id = ?",
            [id, userId]
        );
    }
}

module.exports = Lesson;