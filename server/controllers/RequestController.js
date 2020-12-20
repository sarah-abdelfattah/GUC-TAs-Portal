const ObjectId = require('mongoose').Types.ObjectId;

//const { request } = require('http');
// const { handleError } = require("../utils/handleError");
// required models

const Request=require('../models/Request');
const StaffMember = require('../models/StaffMember');
const Course=require('../models/Course');
const Department=require('../models/Department');
const Notification=require('../models/Notification')
//const { appendFileSync } = require('fs');

exports.sendRequest = async function (req, res) {
  try{
  
  const type=req.body.type;
 //TODO: sender is logged in member from the header
  //  const sender=await StaffMember.findOne({gucID:req.user.gucID }); 
  const senderId = req.body.senderId;
  var sender= await StaffMember.findOne({gucId:senderId}).populate() ;
  // var sender= await StaffMember.findOne({gucID:senderId}). populate();
  //  senderID:req.user.gucID,
  //let send= await StaffMember.findOne({gucID:senderId }) .populate();
    if(!senderId){

       return res.send({ error: 'feeh 7aga 8alat' });}
   
    
    if(!type ){
      
    return res.send({ error: 'please enter all data' });}
    
    if(type=='Replacement Request') {
       
    const recieverId = req.body.recieverId;
    
    const location=req.body.location;
    const coursename=req.body.course;
    const course=await Course.findOne({name:coursename})
    const x=req.body.replacementDate;
 
    const date=new Date(Date.parse(x));
 
    
     // const departmentt=senderInfo. !replacementdate
      if(!recieverId ||!location|| !course){
           
            return res.send({ error: 'please enter all data' });
      }
  
  var rec= await StaffMember.findOne({gucId:recieverId}).populate() ;
    
   var recieverDepartment=rec.department._id;
   var senderdepartment=sender.department._id;
   
    if(!rec){
  return res.send({ error: 'please enter correct  id' });
    }
    if(!( recieverDepartment  .equals(senderdepartment ))){
      return res.send({ error: 'you are not at the same department' });
    }
    var f4=false;

    var foundCourse= await Course.findOne({name:coursename}).populate();
  
  for(i=0;i<rec.courses.length;i++){
      if(rec.courses[i]._id.equals(foundCourse._id)){
        
        f4=true;
      }
    }
    if(!f4){
      return res.send({ error: 'this Ta doesnot teach this Course' });
    }

    var flag=false;
   const x1=new Date(Date.now());
  if(date.getFullYear()==x1.getFullYear()){
    if(date.getMonth()==x1.getMonth()){
      if(date.getDate()>x1.getDate()){
        flag= true; //Ican accept annual leave
      }
    }
    if(date.getMonth()>x1.getMonth()){
    flag= true;
    }
  }
  if(date.getFullYear()>x1.getFullYear()){
    flag=true;
  }
if(!flag){
  return res.send({ error: 'Sorry you Cannot submit this Request' });
}
      const subject=type+" with "+rec.name+" for course " +coursename + " at " + req.body.replacementDate;
      const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        replacemntDate:date,
        location:location,
        coursename:coursename,
        subject:subject
});
 await newRequest.save()
const name=sender.name;
const newNotificatin = new Notification({
  reciever: rec,
  message:name+" "+senderId+" has send you a replacment Request"
  
});
 await newNotificatin.save();
//Notification.create(newNotificatin);
return res.send({ data: newRequest  });
  }
if(type=='Change DayOff') {
  //TODO to be changed
  const department =sender.department;
  const rec=department.HOD
  
  const newDayOff=req.body.newDayOff;
  const currentDayOff=req.body.currentDayOff;
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
//const name=sender.name;
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
  const x=req.body.date;
  const date=new Date(Date.parse(x)); 
  const locationType=req.body.locationType;
  if(!course || !date || !locationType){
    return res.send({ error: 'please enter all data' });
  }
  var foundCourse= await Course.findOne({name:coursename}).populate();
  var f2;
  
  for(i=0;i<sender.courses.length;i++){
      if(sender.courses[i]._id.equals(foundCourse._id)){
        
        f2=true;
      }
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
  } 
if(type=='Leave Request') {
  //const department =sender.department;
  
  var  department= await Department.findOne({_id:sender.department._id});


   
  const recid=department.HOD._id;
  const rec=await StaffMember.findOne({_id:recid})
 
  const leaveType=req.body.leaveType;
  if(!leaveType || !rec){
     
    return res.send({ error: 'please enter all data' });
  }
   
  if(leaveType=="Sick"){
  const  SickDayDate=new Date(Date.parse(req.body.SickDayDate)); 
  var reason=req.body.reason;
if(!reason){
  reason="";
}
  
   if(! SickDayDate ){
    return res.send({ error: 'please enter all data' });
   } 

   
var flag=false;
  const x2=new Date(Date.now());
  if(SickDayDate.getFullYear()==x2.getFullYear()){
    if(SickDayDate.getMonth()==x2.getMonth()){
      if(x2.getDate()-SickDayDate.getDate()<=3){
        flag= true; //Ican accept annual leave
      }
    }
    if(x2.getMonth()-SickDayDate.getMonth()==1){
      var daysInCurrentMonth=new Date(SickDayDate.getFullYear(), SickDayDate.getMonth(), 0).getDate();
   
      if(daysInCurrentMonth-SickDayDate.getDate()+x2.getDate<=3){
        flag= true;
      }
   
    }
  }
  if(x2.getFullYear()>SickDayDate.getUTCFullYear()){
      
    if(SickDayDate.getMonth()==11 && x2.getMonth()==0){
    
    var daysInCurrentMonth=new Date(SickDayDate.getFullYear(), SickDayDate.getMonth(), 0).getDate();
      if(daysInCurrentMonth-SickDayDate.getDate()+x2.getDate<=3){
        flag= true;
      }
    }
    else
      flag=true; 
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
  const cdate=req.body.CompensationDate;
  const CompensationDate=new Date(Date.parse(req.body.CompensationDate)); //date
  const LeaveDate=new Date(Date.parse(req.body.LeaveDate)); 
  const reason=req.body.reason;

   //date
    if(!CompensationDate|| !LeaveDate || ! reason){
      return res.send({ error: 'please enter all data' });
    }
    var flag=false;
    
  if(LeaveDate.getFullYear()<CompensationDate.getFullYear()){
    
    if(LeaveDate.getMonth()==11 && CompensationDate.getMonth()==0){
      
      if(LeaveDate.getDate()>11 &&CompensationDate.getDate()<10 ){
        
      flag=true;
      }
    }
    else{ 
      
      flag=true;}
   }
  else{
    if(LeaveDate.getFullYear()==CompensationDate.getFullYear()){ 
    if(LeaveDate.getMonth()==CompensationDate.getMonth()){
    if(CompensationDate.getDate()>LeaveDate.getDate() ){
       
      flag=true;
      }
    }
    if(LeaveDate.getMonth()<CompensationDate.getMonth()){
      if(LeaveDate.getDate()>11 &&CompensationDate.getDate()<10 ){
      flag=true;
      }
    }
  }}
  if(!flag){
  return res.send({ error: 'Sorry you Cannot submit this Request' });
  }
  const AttendanceRecord=sender.attendanceRecords;
   
  var record;
  var recordDay;
  
  var recdate;
  var f3;
  for(i=0; i<AttendanceRecord.length;i++){
    
   
  if( AttendanceRecord[i].date==cdate){
    record=AttendanceRecord[i].date; 
    recdate= new Date(Date.parse(record));
    recordDay=recdate.getDay();
      f3=true;
      break;
}

  }
  
  var Day;
  switch(recordDay) {
  case 1:
    
    Day="Monday";
    break;
  case 2:
    Day="Tuesday";
    // code block
    break;
    case 3:
      Day="Wednesday";
    // code block
    break;
      case 4:
      Day="Thursday";     
    // code block
    break;
       case 5:
        Day="Friday";
    // code block
    break;
      case 6:
      Day="Saturday"; 
    // code block
    break;
      case 0:  
      Day="Sunday";
    // code block
    break;
}


  if(Day!=sender.dayOff){
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
    const x=req.body.AnnualLeaveDate;
   const AnnualLeaveDate=new Date(Date.parse(x));
    const replacment=req.body.rep;
    
    if(!x){
    return res.send({ error: 'please enter all data' });
    }
      
    for(i=0;i<replacment.length;i++){
      
    var object= replacment[i]; 
   
    const rec= await StaffMember.findOne({gucId:object.id}).populate();
      if(!object.id||! object.date|| !object.courseName){
      
    return res.send({ error: 'please enter all data' });}
    const objectDate=new Date(Date.parse(object.date));
    if(objectDate.getFullYear()!=AnnualLeaveDate.getFullYear() ||objectDate.getMonth()!=AnnualLeaveDate.getMonth()||objectDate.getDate()!=AnnualLeaveDate.getDate()  ){
      return res.send({ error: 'Sorry you Cannot submit this Request: Wrong Date' });
    }
    
    foundReplacmentRequest=await Request.findOne(
      //a7ot status tany
      {type:'Replacement Request', reciever:rec ,status:'accepted' ,sender:sender,   replacemntDate: objectDate});
    if(!foundReplacmentRequest){
        return res.send({ error: 'Sorry you Cannot submit this Request: it is not an accepted replacment' });
    }


    }
    var flag=false;
  const x1=new Date(Date.now());
  if(AnnualLeaveDate.getFullYear()==x1.getFullYear()){
    if(AnnualLeaveDate.getMonth()==x1.getMonth()){
      if(AnnualLeaveDate.getDate()>x1.getDate()){
        flag= true; //Ican accept annual leave
      }
    }
    if(AnnualLeaveDate.getMonth()>x1.getMonth()){
    flag= true;
    }
  }
  if(AnnualLeaveDate.getFullYear()>x1.getFullYear()){
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
        replacments:replacment,
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
if(leaveType=="Accidental"){
  
    var reason=req.body.reason;
if(!reason){
  reason="";
}
if(sender.leaveBalance==0){
      
    return res.send({ error: 'Sorry you cannot your balance is 0' }); 
}
const AccidentDate=new Date(Date.parse(req.body.AccidentDate));
if(!AccidentDate){
  return res.send({ error: 'Please enter all data' }); 
}
const subject=type+" ("+leaveType +") at " + req.body.AccidentDate;
// add status and dender
const Arr= await Request.find({type:"Leave Request",leavetype:"Accidental" ,sender:sender});
//var lucky = await Request.filter({type:"Leave Request" ,leaveType:"Accidental"  });
 

const numberOfDays=Arr.length;
if(numberOfDays>6){
   return res.send({ error: "sorry you cann't take more than 6 days" }); 
}
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