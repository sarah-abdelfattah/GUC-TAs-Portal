const express = require("express");
const router = express.Router();
const auth = require('./auth');

//const { auth } = require("../../utils/authentication");
const attendanceController = require('../controllers/attendanceController');

router.get('/viewAttendance' ,attendanceController.viewAttendance);
router.get('/viewMissingDays', attendanceController.viewMissingDays);
router.get('/viewHours', attendanceController.viewMissingHours);
router.put('/addMissingSignInOut', auth.HRAuth,attendanceController.addMissingSignInOut);

//hr
router.get('/hr/viewAttendance',auth.HRAuth ,attendanceController.viewAttendanceHR);
router.get('/hr/viewStaffMissing', auth.HRAuth,attendanceController.viewStaffWithMissingHoursDays);

module.exports = router;  