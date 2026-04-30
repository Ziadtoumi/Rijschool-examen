const db = require("../config/db");

class Lesson {

    static async getByUser(userId) {
        return await db.query(
            "SELECT id, user_id, DATE_FORMAT(date, '%Y-%m-%d') as date, time, status FROM lessons WHERE user_id = ?",
            [userId]
        );
    }

    static async getBookedTimes(date) {
        return await db.query(
            "SELECT time FROM lessons WHERE DATE_FORMAT(date, '%Y-%m-%d') = ? AND status = 'upcoming'",
            [date]
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

    static async complete(id, userId) {
        return await db.query(
            "UPDATE lessons SET status = 'completed' WHERE id = ? AND user_id = ?",
            [id, userId]
        );
    }
}

module.exports = Lesson;