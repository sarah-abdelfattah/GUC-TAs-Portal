const express = require("express");
const router = express.Router();

const departmentController = require('../controllers/departmentController');


//hr
router.post("/department", departmentController.addDepartment);
router.put("/department", departmentController.updateDepartment);
router.delete("/department", departmentController.deleteDepartment);



module.exports = router;  