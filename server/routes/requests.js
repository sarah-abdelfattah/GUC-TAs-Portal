
//route
const express = require("express");
const router = express.Router();
const RequestController=require('../controllers/RequestController');
//const { auth } = require("../../utils/authentication");
// router.get("/viewMyRequest",RequestController.viewmyReequests); 
// //with staus
// router.get("/viewMyRequest/:type ",RequestController.viewTypeOfRequests) ;
// router.get("/viewMyRequest/:status ",RequestController.viewStatusOfRequests) ;

// router.get("/viewMyRequest/:type ",RequestController.viewSendedRequests) ;
// router.delete("/viewMyRequest/:status ",RequestController.viewSendedRequests) ;
// router.delete("/viewMyRequest/:day ",RequestController.viewSendedRequests) ;


router.post("/SendRequest", RequestController.sendRequest);




module.exports = router;  