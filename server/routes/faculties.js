var express = require("express");
var router = express.Router();
const auth = require('../helpers/auth');
const facultyController = require('../controllers/facultyController');

//HR 
//TODO: return auth
router.get("/faculty/:code", facultyController.getFaculty) //"all"" gets all rooms or the room number 
router.post("/faculty", facultyController.addFaculty);
router.put("/faculty", facultyController.updateFaculty);
router.delete("/faculty", facultyController.deleteFaculty);

module.exports = router;  