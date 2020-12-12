const express = require("express");
const router = express.Router();

const locationController = require('../controllers/locationController');

//const { auth } = require("../../utils/authentication");


//HR only
router.post("/createRoom", locationController.createRoom);
router.post("/updateRoom", locationController.updateRoom);
router.post("/deleteRoom", locationController.deleteRoom);

module.exports = router;  