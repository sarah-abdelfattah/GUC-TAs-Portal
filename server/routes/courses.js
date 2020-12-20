const express = require("express");
const router = express.Router();
const auth = require('./auth');
const courseController = require('../controllers/courseController');

//hr
router.post("/course", auth.HRAuth, courseController.addCourse);
router.put("/course", auth.HRAuth, courseController.updateCourse);
router.delete("/course", auth.HRAuth, courseController.deleteCourse);

module.exports = router;  