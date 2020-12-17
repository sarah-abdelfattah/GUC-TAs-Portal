var express = require("express");
var router = express.Router();

const facultyController = require('../controllers/facultyController');


//HR 
router.post("/faculty", facultyController.addFaculty);
// router.update("/faculty", facultyController.updateFaculty);
router.delete("/faculty", facultyController.deleteFaculty);
router.post("/department", facultyController.addDepartment);
// router.update("/faculty", facultyController.updateDepartment);
router.delete("/department", facultyController.deleteDepartment);

module.exports = router;


module.exports = router;  