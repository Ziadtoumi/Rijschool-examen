const express = require("express");
const router = express.Router();
const LessonController = require("../controllers/LessonController");
const auth = require("../middleware/auth");

router.get("/", auth, LessonController.getLessons);
router.post("/", auth, LessonController.createLesson);
router.delete("/:id", auth, LessonController.cancelLesson);

module.exports = router;