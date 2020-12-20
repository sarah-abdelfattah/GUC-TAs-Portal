const express = require("express");
const router = express.Router();
const auth = require('./auth');

const slotController = require('../controllers/slotController');

router.post('/cc/courseSlot',auth.TAAuth,slotController.addCourseSlot);
router.delete('/cc/courseSlot',auth.TAAuth,slotController.removeCourseSlot);
router.put('/cc/courseSlot',auth.TAAuth,slotController.updateCourseSlot);

module.exports = router;  