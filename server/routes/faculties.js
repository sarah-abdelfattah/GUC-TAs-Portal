var express = require("express");
var router = express.Router();

const facultyController = require('../controllers/facultyController');

//HR 
router.post("/faculty", facultyController.addFaculty);
router.put("/faculty", facultyController.updateFaculty);
router.delete("/faculty", facultyController.deleteFaculty);

module.exports = router;


module.exports = router;  