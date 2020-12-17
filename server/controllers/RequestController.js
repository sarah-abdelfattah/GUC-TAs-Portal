const ObjectId = require('mongoose').Types.ObjectId;

const { request } = require('http');
// const { handleError } = require("../utils/handleError");
// required models

const Request=require('../models/Request');
const StaffMember = require('../models/StaffMember');
const AttendanceRecordSchema = require('../models/schemas/AttendanceRecord');
const { appendFileSync } = require('fs');
exports.sendRequest = async function (req, res) {
  try{
   
  const type=req.body.type;
 //TODO: sender is logged in member from the header
  //  const sender=await StaffMember.findOne({gucID:req.user.gucID }); 
  const senderId = req.body.senderId;
  const sender=await StaffMember.findOne({gucID:senderId });
  //  senderID:req.user.gucID,
  
    
    if(!type){
    return res.send({ error: 'please enter all data' });}
    
    if(type=='Replacement Request') {
    const recieverId = req.body.recieverId;
    const replacementDate = req.body.replacementDate;

    
     // const departmentt=senderInfo.
      if(!recieverId || !replacementDate){
            return res.send({ error: 'please enter all data' });
      }
    const rec=await StaffMember.findOne({gucID:recieverId});
    if(!rec){
  return res.send({ error: 'please enter correct  id' });
    }
      
      const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        replacementDate: replacementDate,
});
newRequest.save()
const name=sender.name;
const newNotificatin = new Notification({
  reciever: rec,
  message:name+" "+senderId+" has send you a replacement Request"

});
newNotificatin.save();
return res.send({ data: newRequest  });
  }
if(type=='Change DayOff') {
  const faculty=sender.faculty;
  var rec;
  var found=false
  i=0;
  while(!found){
    if(faculty.departments[i]==sender.departement){
      found=true;
      rec=faculty.departments[i].HOD
    }
    i+=1;
  }
  const newDayOff=req.body.newDayOff;
  const currentDayOff=req.sender.currentDayOff;
  if(!newDayOff || !currentDayOff){
  return res.send({ error: 'please enter all data' });
}
const newRequest= new Request({
  //TODO a4eel el sender
  senderId:senderId,
  type:type,
  newDayOff:newDayOff,
  currentDayOff:currentDayOff
});
newRequest.save();
const name=sender.name;
// const newNotificatin = new Notification({
//   reciever: rec,
//   message:name+" "+senderId+" has send you a Change DayOff Request"

// });
// newNotificatin.save();
return res.send({ data: newRequest  });

  }
if(type=='Leave Request') {
  const faculty=sender.faculty;
  var rec;
  found=false
  i=0;
  while(!found){
    if(faculty.departments[i]==sender.departement){
      found=true;
      rec=faculty.departments[i].HOD
    }
    i+=1;
  }
  const leaveType=req.body.leaveType;
  if(!leaveType){
    return res.send({ error: 'please enter all data' });
  }
  if(leaveType=="Sick"){
  const  SickDayDate=req.body.SickDayDate;
  var reason=req.body.reason;
if(!reason){
  reason="";
}
   if(! SickDayDate){
    return res.send({ error: 'please enter all data' });
   } 
   //TODO a5od function date mn reem
    // if(SickDayDate-Date.now>3){
    // return res.send({ error: 'not accepted you have exceeded max number of days' });
// } 
 const document=req.body.document;
  if(!document ){
    return res.send({ error: 'please enter all data' });
  } 
  const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        leavetype: leaveType,
        SickDayDate:SickDayDate,
        document:document,
        reason:reason
});
newRequest.save()
return res.send({ data: newRequest  });
  }
if(leaveType=="Compensation"){
    const CompensationDate=new Date(Date.parse(req.body.CompensationDate)); //date
  const LeaveDate=new Date(Date.parse(req.body.LeaveDate)); 
  const reason=req.body.reason;

   //date
    if(!CompensationDate|| !LeaveDate || ! reason){
      return res.send({ error: 'please enter all data' });
    }
    var flag=false;
    //TODO yb2o nafs el month
  if(LeaveDate.getFullYear()<CompensationDate.getFullYear()){
    if(LeaveDate.getMonth()+1==12 && CompensationDate.getMonth()+1==1){
      if(LeaveDate.getDate>11 &&CompensationDate.getDate<10 ){
      flag=true;
      }
    }
  }
  else{
    if(LeaveDate.getMonth()==CompensationDate.getMonth()){
    if(CompensationDate.getDate>LeaveDate.getDate ){
      flag=true;
      }
    }
    if(LeaveDate.getMonth()<CompensationDate.getMonth()){
      if(LeaveDate.getDate>11 &&CompensationDate.getDate<10 ){
      flag=true;
      }
    }
  }
  if(!flag){
   return res.send({ error: 'Sorry you Cannot submit this Request' });
  }
  const record=await AttendanceRecordSchema.findOne({date:CompensationDate});
  if(record.day!=sender.dayOff){
  return res.send({ error: 'Sorry you Cannot submit this Request' });
  }
  // search in his requests that there is no compansation    request of the same day
  var f1=false;
  const request=await Request.findOne({date:CompensationDate,sender:sender});
  if(request){
    const leavetype=request.leaveType;
    if(leavetype&&request.leavetype=="Compensation"){
        f1=true;
    }
  }
  if(f1){
return res.send({ error: 'Sorry you Cannot submit this Request' });

  }
 
  const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        leavetype: leaveType,
        CompensationDate: CompensationDate,
        LeaveDate: LeaveDate,
        reason:reason
});
newRequest.save()
return res.send({ data: newRequest  });
  }

if(leaveType=="Annual"){
  
var reason=req.body.reason;
if(!reason){
  reason="";
} 
    //should be submitted before targeted day
    const AnnualLeaveDate=new Date(Date.parse(req.body.CompensationDate));
    var TAID=req.body.TAID;
    if(!AnnualLeaveDate){
    return res.send({ error: 'please enter all data' });
    }
    if(!TAID){
      TAID="";
    }
    var flag=false;
    
  if(AnnualLeaveDate.getFullYear()==Date.now().getFullYear()){
    if(AnnualLeaveDate.getMonth()==Date.now().getMonth()){
      if(AnnualLeaveDate.getDate()>Date.now().getDate()){
        flag= true; //Ican accept annual leave
      }
    }
    if(AnnualLeaveDate.getMonth()>Date.now().getMonth()){
    flag= true;
    }
  }
  if(AnnualLeaveDate.getFullYear()>Date.now().getFullYear()){
    flag=true;
  }
if(!flag){
  return res.send({ error: 'Sorry you Cannot submit this Request' });
}


    const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        leavetype: leaveType,
        AnnualLeaveDate:AnnualLeaveDate,
        TAID:TAID,
        reason:reason
      
});
newRequest.save()
return res.send({ data: newRequest  });
  }
if(leaveType=="Maternity"){

if(sender.gender!="female"){
return res.send({ error: 'Sorry you Cannot submit this Request' });
}
var reason=req.body.reason;
if(!reason){
  reason="";
} 
const doc=req.body.document;
if(!doc){
return res.send({ error: 'Please enter all data' }); 
}






  const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        leavetype: leaveType,
        
        document:doc,
        reason:reason
      
});
newRequest.save()
return res.send({ data: newRequest  });
  }
  if(leaveType=="Accidential"){
    var reason=req.body.reason;
if(!reason){
  reason="";
} 
    const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        leavetype: leaveType,
        
        
        reason:reason
      
});
newRequest.save()
return res.send({ data: newRequest  });
  }

    }

  }
  // const NewRequest = await Request.post(senderID,recieverId,req.body);
  
catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }

}