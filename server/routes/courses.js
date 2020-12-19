const express = require("express");
const router = express.Router();

const courseController = require('../controllers/courseController');

//hr
router.post("/course", courseController.addCourse);
router.put("/course", courseController.updateCourse);
router.delete("/course", courseController.deleteCourse);

module.exports = router;  