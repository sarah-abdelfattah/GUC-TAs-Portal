const express = require("express");
const router = express.Router();
const staffMember = require('../models/StaffMember')

//const { auth } = require("../../utils/authentication");

router.post("/login", staffMemberController.login);


module.exports = router;  