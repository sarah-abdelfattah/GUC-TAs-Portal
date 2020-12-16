var express = require("express");
var router = express.Router();

const facultyController = require('../controllers/facultyController');


//HR 
router.post("/add", facultyController.addFaculty);
// router.update("/update", facultyController.updateFaculty);
// router.delete("/delete", facultyController.deleteFaculty);


module.exports = router;


module.exports = router;  