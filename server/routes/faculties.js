var express = require("express");
var router = express.Router();
const auth = require('../helpers/auth');
const facultyController = require('../controllers/facultyController');

//HR 
router.post("/faculty", auth.HRAuth, facultyController.addFaculty);
router.put("/faculty", auth.HRAuth, facultyController.updateFaculty);
router.delete("/faculty", auth.HRAuth, facultyController.deleteFaculty);

module.exports = router;  