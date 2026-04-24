const express = require("express");
const router = express.Router();
const LessonController = require("../controllers/LessonController");
const AuthMiddleware = require("../middleware/auth");

router.get("/", AuthMiddleware.verify, LessonController.getLessons);
router.post("/", AuthMiddleware.verify, LessonController.createLesson);
router.put("/:id/cancel", AuthMiddleware.verify, LessonController.cancelLesson);

module.exports = router;