const express = require("express");
const router = express.Router();

const courseController = require('../controllers/courseController');

//const { auth } = require("../../utils/authentication");


router.post("/create", courseController.createCourse);

module.exports = router;  