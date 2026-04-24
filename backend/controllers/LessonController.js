const Lesson = require("../models/Lesson");

class LessonController {

    static async getLessons(req, res) {
        const lessons = await Lesson.getByUser(req.user.id);
        res.json(lessons);
    }

    static async createLesson(req, res) {
        const { date, time } = req.body;

        await Lesson.create(req.user.id, date, time);
        res.json({ msg: "Lesson added" });
    }

    static async cancelLesson(req, res) {
        await Lesson.cancel(req.params.id, req.user.id);
        res.json({ msg: "Lesson cancelled" });
    }
}

module.exports = LessonController;