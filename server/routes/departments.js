const express = require("express");
const router = express.Router();

const departmentController = require('../controllers/departmentController');


//hr
router.post("/department", departmentController.addDepartment);
router.put("/department", departmentController.updateDepartment);
router.delete("/department", departmentController.deleteDepartment);

// HOD

// get all staff members of this department
router.get('/:departmentName/:idHOD/getAllStaffMembers', departmentController.getAllStaffMembers);

// to get all the staff members of this department for a specific course
router.get('/:departmentName/:idHOD/:course/getAllStaffMembers', departmentController.getStaffMembersPerCourse);

// to view the dayOff of all staff members for this department
router.get('/:departmentName/:idHOD/viewDayOff', departmentController.viewDayOff);

// to view the dayOff of a certain staff member in this department
router.get('/:departmentName/:idHOD/viewDayOff/:idStaff', departmentController.viewDayOffStaff);

// to view the all courses coverage for a certain department
router.get('/:departmentName/:idHOD/viewCourseCoverage', departmentController.viewCourseCoverage);

module.exports = router;  