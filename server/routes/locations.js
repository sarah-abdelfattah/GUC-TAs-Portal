const express = require("express");
const router = express.Router();

const locationController = require('../controllers/locationController');

//const { auth } = require("../../utils/authentication");


//HR only
router.get("/room/:num", locationController.getRoom) //"all"" gets all rooms or the room number 
router.post("/createRoom", locationController.createRoom);
router.post("/updateRoom", locationController.updateRoom);
router.post("/deleteRoom", locationController.deleteRoom);

module.exports = router;  