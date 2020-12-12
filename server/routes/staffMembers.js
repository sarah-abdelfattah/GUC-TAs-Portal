const express = require("express");
const router = express.Router();
const staffMemberController = require('../controllers/staffMemberController');

router.get('/', function (req, res) {
    res.send('HEY!');
})

//const { auth } = require("../../utils/authentication");
router.post("/register", staffMemberController.registerStaff);
router.post("/login", staffMemberController.login);


module.exports = router;  