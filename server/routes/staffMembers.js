var express = require("express");
var router = express.Router();
const auth = require('./auth');

const staffMemberController = require('../controllers/staffMemberController');

//HR 
router.post("/staff", auth.HRAuth, staffMemberController.registerStaff);
router.put("/staff", auth.HRAuth, staffMemberController.updateStaff);
router.delete("/staff", auth.HRAuth, staffMemberController.deleteStaff);
router.put("/updateSalary", auth.HRAuth, staffMemberController.updateSalary);

//academic member
router.get('/viewMySchedule', auth.AcademicMemberAuth, staffMemberController.viewMySchedule);


//all users
router.post("/logOut", staffMemberController.logout);
router.post("/signIn", staffMemberController.signIn);
router.post("/signOut", staffMemberController.signOut);

router.post("/changePassword", staffMemberController.changePassword);

router.put("/profile", staffMemberController.updateProfile);
router.get("/profile", staffMemberController.getProfile);

module.exports = router;  