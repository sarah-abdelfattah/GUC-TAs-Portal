const express = require("express");
const router = express.Router();
const auth = require('../helpers/auth');
const locationController = require('../controllers/locationController');

//HR only
//TODO: return auth
router.get("/room/:num", locationController.getRoom) //"all"" gets all rooms or the room number 
router.post("/location", locationController.createRoom);
router.put("/location", locationController.updateRoom);
router.delete("/location", locationController.deleteRoom);

module.exports = router;  