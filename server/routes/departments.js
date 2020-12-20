const express = require("express");
const router = express.Router();
const auth = require('./auth');
const departmentController = require('../controllers/departmentController');

//hr
router.post("/department", auth.HRAuth, departmentController.addDepartment);
router.put("/department", auth.HRAuth, departmentController.updateDepartment);
router.delete("/department", auth.HRAuth, departmentController.deleteDepartment);

module.exports = router;  