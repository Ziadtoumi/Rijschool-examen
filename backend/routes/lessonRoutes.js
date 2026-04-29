const express = require("express");
const router = express.Router();
const LessonController = require("../controllers/LessonController");
const auth = require("../middelware/auth");

router.get("/booked", auth, LessonController.getBookedTimes);
router.get("/", auth, LessonController.getLessons);
router.post("/", auth, LessonController.createLesson);
router.put("/:id/complete", auth, LessonController.completeLesson);
router.delete("/:id", auth, LessonController.cancelLesson);

module.exports = router;