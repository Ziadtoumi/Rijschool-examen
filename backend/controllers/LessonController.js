const Lesson = require("../models/Lesson");

class LessonController {

    static async getLessons(req, res) {
        try {
            const lessons = await Lesson.getByUser(req.user.id);
            res.json(lessons);
        } catch (err) {
            res.status(500).json({ msg: "Server fout" });
        }
    }

    static async getBookedTimes(req, res) {
        try {
            const { date } = req.query;
            if (!date) return res.json([]);
            const times = await Lesson.getBookedTimes(date);
            res.json(times.map(t => t.time));
        } catch (err) {
            res.status(500).json({ msg: "Server fout" });
        }
    }

    static async createLesson(req, res) {
        try {
            const { date, time } = req.body;

            if (!date || !time) {
                return res.status(400).json({ msg: "Vul datum en tijd in" });
            }

            const booked = await Lesson.getBookedTimes(date);
            const bookedTimes = booked.map(t => t.time);

            if (bookedTimes.includes(time)) {
                return res.status(400).json({ msg: "Dit tijdstip is al bezet" });
            }

            await Lesson.create(req.user.id, date, time);
            res.json({ msg: "Les toegevoegd" });
        } catch (err) {
            res.status(500).json({ msg: "Server fout" });
        }
    }

    static async cancelLesson(req, res) {
        try {
            await Lesson.cancel(req.params.id, req.user.id);
            res.json({ msg: "Les geannuleerd" });
        } catch (err) {
            res.status(500).json({ msg: "Server fout" });
        }
    }

    static async completeLesson(req, res) {
        try {
            await Lesson.complete(req.params.id, req.user.id);
            res.json({ msg: "Les afgerond" });
        } catch (err) {
            res.status(500).json({ msg: "Server fout" });
        }
    }
}

module.exports = LessonController;