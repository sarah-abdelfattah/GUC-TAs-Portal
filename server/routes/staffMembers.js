var express = require("express");
var router = express.Router();
const auth = require('./auth');

const staffMemberController = require('../controllers/staffMemberController');

// function requiresAdmin(req, res, next) {
//     console.log("OKKKKKKK")
//     console.log(req.user);

//     // if (req.user.admin !== true) {
//     //     // res.status(401).end();
//     // } else {
//     //     next();
//     // }
// }

//HR 
router.post("/staff", staffMemberController.registerStaff);
router.put("/staff", staffMemberController.updateStaff);
router.delete("/staff", staffMemberController.deleteStaff);

//all users
// router.post("/logIn", staffMemberController.login);
router.post("/logOut", staffMemberController.logout);
router.post("/signIn", auth.AcademicMemberAuth, staffMemberController.signIn);
router.post("/signOut", staffMemberController.signOut);

router.post("/changePassword", staffMemberController.changePassword);
module.exports = router;  