const express = require("express");
const router = express.Router();
const auth = require('../helpers/auth');
const locationController = require('../controllers/locationController');

//HR only
router.get("/room/:num", auth.HRAuth, locationController.getRoom) //"all"" gets all rooms or the room number 
router.post("/createRoom", auth.HRAuth, locationController.createRoom);
router.post("/updateRoom", auth.HRAuth, locationController.updateRoom);
router.post("/deleteRoom", auth.HRAuth, locationController.deleteRoom);

module.exports = router;  