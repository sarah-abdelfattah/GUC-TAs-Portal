var express = require("express");
var router = express.Router();

const facultyController = require('../controllers/facultyController');


//HR 
router.post("/faculty", facultyController.addFaculty);
router.put("/faculty", facultyController.updateFaculty);
router.delete("/faculty", facultyController.deleteFaculty);

router.post("/department", facultyController.addDepartment);
router.put("/department", facultyController.updateDepartment);
router.delete("/department", facultyController.deleteDepartment);

router.post("/course", facultyController.addCourse);
// router.put("/course", facultyController.updateCourse);
// router.delete("/course", facultyController.deleteCourse);

module.exports = router;


module.exports = router;  