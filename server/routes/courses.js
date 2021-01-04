const express = require("express");
const router = express.Router();
const auth = require('../helpers/auth');
const courseController = require('../controllers/courseController');

//hr
router.post("/course", auth.HRAuth, courseController.addCourse);
router.put("/course", auth.HRAuth, courseController.updateCourse);
router.delete("/course", auth.HRAuth, courseController.deleteCourse);
router.get("/course/:faculty/:department/:course", courseController.getCourse);

module.exports = router;  