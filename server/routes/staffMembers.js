var express = require("express");
var router = express.Router();

const staffMemberController = require('../controllers/staffMemberController');

//const { auth } = require("../../utils/authentication");

//HR 
router.post("/register", staffMemberController.registerStaff);
router.post("/update", staffMemberController.updateStaff);
router.post("/delete", staffMemberController.deleteStaff);

//all users
router.post("/login", staffMemberController.login);
router.post("/signIn", staffMemberController.signIn);
router.post("/signOut", staffMemberController.signOut);


module.exports = router;  