var express = require("express");
var router = express.Router();

const staffMemberController = require('../controllers/staffMemberController');

//const { auth } = require("../../utils/authentication");

//HR 
router.post("/staff", staffMemberController.registerStaff);
router.put("/staff", staffMemberController.updateStaff);
router.delete("/staff", staffMemberController.deleteStaff);

//all users
router.post("/login", staffMemberController.login);
router.post("/signIn", staffMemberController.signIn);
router.post("/signOut", staffMemberController.signOut);

router.post("/changePassword", staffMemberController.changePassword);
module.exports = router;  