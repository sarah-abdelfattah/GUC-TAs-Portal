
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
// //with staus
// router.get("/viewMyRequest/:type ",RequestController.viewTypeOfRequests) ;
// router.get("/viewMyRequest/:status ",RequestController.viewStatusOfRequests) ;

// router.get("/viewMyRequest/:type ",RequestController.viewSendedRequests) ;
// router.delete("/viewMyRequest/:status ",RequestController.viewSendedRequests) ;
// router.delete("/viewMyRequest/:day ",RequestController.viewSendedRequests) ;

//TODO add replacment

router.post("/sendrequest",auth.AcademicMemberAuth, RequestController.sendRequest);




module.exports = router;  