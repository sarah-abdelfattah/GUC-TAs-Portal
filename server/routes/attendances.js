const express = require("express");
const router = express.Router();
const auth = require('./auth');

const attendanceController = require('../controllers/attendanceController');

router.get('/viewAttendance', attendanceController.viewAttendance);
router.get('/viewMissingDays', attendanceController.viewMissingDays);
router.get('/viewHours', attendanceController.viewMissingHours);
router.put('/addMissingSignInOut', auth.HRAuth, attendanceController.addMissingSignInOut);

//hr
router.get('/viewStaffAttendance', auth.HRAuth, attendanceController.viewAttendanceHR);
router.get('/viewStaffMissing', auth.HRAuth, attendanceController.viewStaffWithMissingHoursDays);

module.exports = router;  