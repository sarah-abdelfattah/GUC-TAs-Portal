var express = require("express");
var router = express.Router();

const staffMemberController = require('../controllers/staffMemberController');

//const { auth } = require("../../utils/authentication");

//
router.post("/register", staffMemberController.registerStaff);
//all users
router.post("/login", staffMemberController.login);


module.exports = router;  