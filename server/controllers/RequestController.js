const ObjectId = require('mongoose').Types.ObjectId;

const { request } = require('http');
// const { handleError } = require("../utils/handleError");
// required models
const Replacment= require('../models/schemas/replacment');
const Request=require('../models/Request');
const StaffMember = require('../models/StaffMember');
const Course=require('../models/Course');

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
    const replacmentDate = new Date(Date.parse(req.body.replacementDate)); 
    const location=req.body.location;
    const coursename=req.body.course;
    const course=await Course.findOne({name:coursename})

    
     // const departmentt=senderInfo.
      if(!recieverId || !replacementDate ||!location|| !course){
            return res.send({ error: 'please enter all data' });
      }
    const rec=await StaffMember.findOne({gucID:recieverId});
    const department=rec.department;
    if(!rec){
  return res.send({ error: 'please enter correct  id' });
    }
    if(!department==sender.department){
      return res.send({ error: 'you are not at the same department' });
    }
    var f4=false;
    for(i=0;i<rec.courses.length;i++){
      if(courses[i].name==coursename){
        f4=true;
      }
    }
    if(!f4){
      return res.send({ error: 'this Ta doesnot teach this Course' });
    }
      const subject=type+" with "+rec.name+" for course " +coursename + " at " + req.body.replacementDate;
      const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        replacemntDate: replacmentDate,
        location:location,
        coursename:coursename,
        subject:subject
});
newRequest.save()
const name=sender.name;
const newNotificatin = new Notification({
  reciever: rec,
  message:name+" "+senderId+" has send you a replacment Request"

});
newNotificatin.save();
return res.send({ data: newRequest  });
  }
if(type=='Change DayOff') {
  //TODO to be changed
  const department =sender.department;
  const rec=department.HOD
  
  const newDayOff=req.body.newDayOff;
  const currentDayOff=req.sender.currentDayOff;
  if(!newDayOff || !currentDayOff){
  return res.send({ error: 'please enter all data' });
}
const subject=type+" Request from "+ currentDayOff +" to "+newDayOff;
const newRequest= new Request({
  //TODO a4eel el sender
  sender:senderId,
  reciever:rec,
  type:type,
  newDayOff:newDayOff,
  currentDayOff:currentDayOff,
  subject:subject
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
  if(type=='Slot Request') {
  const coursename=req.body.course;
  const course=await Course.findOne({name:coursename});
  const rec=course.courseCoordinator;
  const date=new Date(Date.parse(req.body.date)); 
  const locationType=req.body.locationType;
  if(!course || !date || !locationType){
    return res.send({ error: 'please enter all data' });
  }
  const courses=sender.courses
  var f2;
  for(i=0; i<courses.length;i++){
  if( courses[i].name==coursename){
    
    f2=true;
 }
 if(!f2){
  return res.send({ error: 'please enter correct course name' });
 }
const subject=type+" at "+ req.body.date +"of course "+ coursename;
const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        coursename:coursename,
        date:date,
      locationType:locationType,
      subject:subject
        
});
newRequest.save()
return res.send({ data: newRequest  });
  }}
if(type=='Leave Request') {
  const department =sender.department;
  const rec=department.HOD

  
  const leaveType=req.body.leaveType;
  if(!leaveType){
    return res.send({ error: 'please enter all data' });
  }
  if(leaveType=="Sick"){
  const  SickDayDate=new Date(Date.parse(req.body.SickDayDate)); 
  var reason=req.body.reason;
if(!reason){
  reason="";
}
   if(! SickDayDate){
    return res.send({ error: 'please enter all data' });
   } 

   
var flag=false;
  
  if(SickDayDate.getFullYear()==Date.now().getFullYear()){
    if(SickDayDate.getMonth()==Date.now().getMonth()){
      if(SickDayDate.getDate()-Date.now().getDate()<=3){
        flag= true; //Ican accept annual leave
      }
    }
    if(SickDayDate.getMonth()>Date.now().getMonth()){
      var daysInCurrentMonth=new Date(Date.now().getFullYear(), Date.now().getMonth(), 0).getDate();
      if(daysInCurrentMonth-SickDayDate.getDate()+Date.now().getDate<=3){
 flag= true;
      }
   
    }
  }
  if(SickDayDate.getFullYear()>Date.now().getFullYear()){
     var daysInCurrentMonth=new Date(Date.now().getFullYear(), Date.now().getMonth(), 0).getDate();
      if(daysInCurrentMonth-SickDayDate.getDate()+Date.now().getDate<=3){
flag= true;
      }
    
    
  }
if(!flag){
  return res.send({ error: 'Sorry you Cannot submit this Request' });
} 

const document=req.body.document;
  if(!document ){
    return res.send({ error: 'please enter all data' });
  } 
  const subject=type+" ("+leaveType +") at " + req.body.SickDayDate;
  const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        leavetype: leaveType,
        SickDayDate:SickDayDate,
        document:document,
        reason:reason,
        subject:subject
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
  const AttendanceRecord=sender.attendanceRecords;
  var record;
  var f3;
  for(i=0; i<AttendanceRecord.length;i++){
   if( AttendanceRecord[i].date==CompensationDate){
    record=AttendanceRecord[i].date;
    f3=true;
}

  }
  
  var recordDay=record.day
  
  switch(recordDay) {
  case "1":
    // 
    recordDay="Monday";
    break;
  case "2":
    recordDay="Tuesday";
    // code block
    break;
    case "3":
  recordDay="Wednesday";
    // code block
    break;
      case "4":
      recordDay="Thursday";     
    // code block
    break;
      case "5":
        recordDay="Friday";
    // code block
    break;
      case "6":
        recordDay="Saturday"; 
    // code block
    break;
      case "7":  
      recordDay="Sunday";
    // code block
    break;
}

  if(recordDay!=sender.dayOff){
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
   const subject=type+" ("+leaveType +") at " + req.body.CompensationDate;
  const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        leavetype: leaveType,
        CompensationDate: CompensationDate,
        LeaveDate: LeaveDate,
        reason:reason,
        subject:subject
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
    const AnnualLeaveDate=new Date(Date.parse(req.body.AnnualLeaveDat));
    const replacmentArray=[Replacment];
    //var TAID=req.body.TAID;
    if(!AnnualLeaveDate){
    return res.send({ error: 'please enter all data' });
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
    const subject=type+" ("+leaveType +") at " + req.body.AnnualLeaveDate;

    const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        leavetype: leaveType,
        AnnualLeaveDate:AnnualLeaveDate,
        replacments:replacmentArray,
        reason:reason,
        subject:subject
      
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
const startDate=new Date(Date.parse(req.body.startDate));
if(!doc || !startDate){
return res.send({ error: 'Please enter all data' }); 
}



 const subject=type+" ("+leaveType +") at " + req.body.startDate;


  const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        leavetype: leaveType,
        startDate:startDate,
        document:doc,
        reason:reason,
        subject:subject
      
});
newRequest.save()
return res.send({ data: newRequest  });
  }
  if(leaveType=="Accidential"){
    var reason=req.body.reason;
if(!reason){
  reason="";
} 
const AccidentDate=new Date(Date.parse(req.body.AccidentDate));
if(!AccidentDate){
  return res.send({ error: 'Please enter all data' }); 
}
const subject=type+" ("+leaveType +") at " + req.body.AccidentDate;

    const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        leavetype: leaveType,
        AccidentDate:AccidentDate,
      
        reason:reason,
        subject:subject
      
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


exports.viewmyReequests = async function (req, res) {
  try{ 
  senderID=req.user.gucID;
  
  var searchQuery = {senderID:senderID}; //or something specific  
  var Array = [];


Request
  .find(searchQuery)
  .exec()
  .then(function(requests){
      //here you can assign result value to your variable
      //but this action is useless as you are working with results directly 
      //TODO select date and message b3deen a3ml route gdeed
      Array = request ;
      return res.send({ data:requests});
  })
  .onReject(function(err){
     res.send({ err: err }); //or something else
  });
  
  }
  catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}