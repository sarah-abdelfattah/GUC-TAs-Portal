
//route
const express = require("express");
const router = express.Router();
const RequestController=require('../controllers/RequestController');
const auth = require('./auth');
 
//const { auth } = require("../../utils/authentication");
router.get("/viewMyRequest",auth.AcademicMemberAuth,RequestController.viewmyReequests); 
//router.get("/viewMyRequest/:id",auth.AcademicMemberAuth,RequestController.viewmyReequests);
router.get("/viewMyRequeststatus/:status",auth.AcademicMemberAuth,RequestController.viewmyReequestsByStatus); 
router.get("/viewMyRequestType/:type",auth.AcademicMemberAuth,RequestController.viewmyReequestsByType); 
router.get("/viewRecievedReplacementRequest",auth.AcademicMemberAuth,RequestController.viewRecievedReplacementRequest ); 
router.get("/viewSlotRequest",auth.CCAuth,RequestController.viewSlotRequest ); 
router.get("/viewRecievedRequest/:type",auth.HODAuth,RequestController.viewRecievedRequest ); 
router.get("/viewNotification",auth.AcademicMemberAuth,RequestController.viewNotification  ); 
router.put("/AcceptOrRejectRep/_id",auth.AcademicMemberAuth,RequestController.AcceptOrRejectRep ); 
router.put("/AcceptOrRejectChangeDay/_id",auth.HODAuth,RequestController.AcceptOrRejectChangeDay ); 
router.put("/AcceptOrRejectSlot/_id",auth.CCAuth,RequestController.AcceptOrRejectSlot ); 
router.put("/AcceptOrRejectLeave/_id",auth.HODAuth,RequestController.AcceptOrRejectLeave ); 

//view notification
// router.get("/viewMyRequest/:type ",RequestController.viewSendedRequests) ;
// router.delete("/viewMyRequest/:status ",RequestController.viewSendedRequests) ;
// router.delete("/viewMyRequest/:day ",RequestController.viewSendedRequests) ;

//TODO add replacment

router.post("/sendrequest",auth.AcademicMemberAuth, RequestController.sendRequest);




module.exports = router;  