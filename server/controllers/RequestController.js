const ObjectId = require('mongoose').Types.ObjectId;

//const { request } = require('http');
// const { handleError } = require("../utils/handleError");
// required models

const Request = require('../models/Request');
const StaffMember = require('../models/StaffMember');
const Course = require('../models/Course');
const Department = require('../models/Department');
const Notification = require('../models/Notification');
const Location = require('../models/Location');
const { request } = require('express');
//const { find } = require('../models/Request');
//const { appendFileSync } = require('fs');

exports.sendRequest = async function (req, res) {
  try {
    const type = req.body.type;
    //TODO: sender is logged in member from the header
    //  const sender=await StaffMember.findOne({gucID:req.user.gucID });
    const senderId = req.user.gucId;
    var sender = await StaffMember.findOne({ gucId: senderId }).populate();
    // var sender= await StaffMember.findOne({gucID:senderId}). populate();
    //  senderID:req.user.gucID,
    //let send= await StaffMember.findOne({gucID:senderId }) .populate();
    if (!senderId) {
      return res.send({ error: 'feeh 7aga 8alat' });
    }

    if (!type) return res.send({ error: 'Please enter the type of your request' });

    if (type == 'Replacement Request') {
      const recieverId = req.body.recieverId;
      const location = req.body.location;
      const coursename = req.body.course;

      //const course=await Course.findOne({name:coursename})
      const x = req.body.replacementDate;

      const date = new Date(Date.parse(x));
      if (!date) return res.send({ error: 'Please enter a valid date' });

      // const departmentt=senderInfo. !replacementdate
      if (!recieverId || !location || !coursename || !x) {
        return res.send({ error: 'Please enter all the missing fields' });
      }

      var rec = await StaffMember.findOne({ gucId: recieverId }).populate();
      if (!rec) {
        return res.send({ error: 'Please enter the correct receiver id' });
      }

      var recieverDepartment = rec.department._id;
      var senderdepartment = sender.department._id;
      if (!recieverDepartment.equals(senderdepartment)) {
        return res.send({ error: 'You are not at the same department' });
      }

      var f4 = false;

      var foundCourse = await Course.findOne({ name: coursename }).populate();
      if (!foundCourse) return res.send({ error: 'This course is not found' });

      var loc = await Location.findOne({ location: location });
      if (!loc) return res.send({ error: 'This location is not found' });

      for (i = 0; i < rec.courses.length; i++) {
        if (rec.courses[i]._id.equals(foundCourse._id)) {
          f4 = true;
        }
      }
      if (!f4) {
        return res.send({ error: 'This TA does not teach this course' });
      }

      var flag = false;
      const x1 = new Date(Date.now());
      if (date.getFullYear() == x1.getFullYear()) {
        if (date.getMonth() == x1.getMonth()) {
          if (date.getDate() > x1.getDate()) {
            flag = true; //Ican accept annual leave
          }
        }
        if (date.getMonth() > x1.getMonth()) {
          flag = true;
        }
      }
      if (date.getFullYear() > x1.getFullYear()) {
        flag = true;
      }
      if (!flag) {
        return res.send({ error: 'Sorry you cannot submit this request' });
      }
      const subject = type + ' with ' + rec.name + ' for course ' + coursename + ' at ' + req.body.replacementDate;
      const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        replacemntDate: date,
        location: location,
        coursename: coursename,
        subject: subject,
      });
      await newRequest.save();
      const name = sender.name;
      const newNotificatin = new Notification({
        reciever: rec,
        message: name + ' ' + senderId + ' has send you a replacment Request',
      });
      await newNotificatin.save();
      //Notification.create(newNotificatin);
      return res.send({ data: newRequest });
    }
    
    if (type == 'Change DayOff') {
      //TODO to be changed
      var department = await Department.findOne({ _id: sender.department._id });
      const recid = department.HOD._id;
      const rec = await StaffMember.findOne({ _id: recid });

      const newDayOff = req.body.newDayOff;
      const currentDayOff = sender.dayOff;
      if (!newDayOff) {
        return res.send({ error: 'please enter all data' });
      }
      if (newDayOff != 'Saturday' || newDayOff != 'Monday' || newDayOff != 'Tuesday' || newDayOff != 'Wednesday' || newDayOff != 'Thursday') {
        return res.send({ error: 'please enter correct Day' });
      }
      const subject = type + ' Request from ' + currentDayOff + ' to ' + newDayOff;
      const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        newDayOff: newDayOff,
        currentDayOff: currentDayOff,
        subject: subject,
      });
      await newRequest.save();
      //const name=sender.name;
      // const newNotificatin = new Notification({
      //   reciever: rec,
      //   message:name+" "+senderId+" has send you a Change DayOff Request"

      // });
      // newNotificatin.save();
      return res.send({ data: newRequest });
    }

    if (type == 'Slot Request') {
      const coursename = req.body.course;
      const rec = course.courseCoordinator;
      const x = req.body.date;
      const locationType = req.body.locationType;
      if (!coursename || !x || !locationType) {
        return res.send({ error: 'please enter all data' });
      }

      const course = await Course.findOne({ name: coursename });
      const date = new Date(Date.parse(x));

      if (locationType != 'Tutorial Room' || locationType != 'Lecture Hall' || locationType != 'Lab')
        if (!course || !date) {
          return res.send({ error: 'please enter Correct location type' });
        }
      if (!course || !date || !locationType) {
        return res.send({ error: 'please enter all data' });
      }
      var foundCourse = await Course.findOne({ name: coursename }).populate();
      var f2;

      for (i = 0; i < sender.courses.length; i++) {
        if (sender.courses[i]._id.equals(foundCourse._id)) {
          f2 = true;
        }
      }

      if (!f2) {
        return res.send({ error: 'please enter correct course name' });
      }
      const subject = type + ' at ' + req.body.date + 'of course ' + coursename;
      const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        coursename: coursename,
        date: date,
        locationType: locationType,
        subject: subject,
      });
      await newRequest.save();
      return res.send({ data: newRequest });
    }
    if (type == 'Leave Request') {
      //const department =sender.department;

      var department = await Department.findOne({ _id: sender.department._id });
      const recid = department.HOD._id;
      const rec = await StaffMember.findOne({ _id: recid });

      const leaveType = req.body.leaveType;

      if (!leaveType) {
        return res.send({ error: 'please enter all data' });
      }
      if (!rec) {
        return res.send({ error: 'there is no HOD for this Department' });
      }

      if (leaveType == 'Sick') {
        const SickDayDate = new Date(Date.parse(req.body.SickDayDate));
        var reason = req.body.reason;
        if (!reason) {
          reason = '';
        }

        if (!SickDayDate) {
          return res.send({ error: 'please enter correct date' });
        }

        var flag = false;
        const x2 = new Date(Date.now());
        if (SickDayDate.getFullYear() == x2.getFullYear()) {
          if (SickDayDate.getMonth() == x2.getMonth()) {
            if (x2.getDate() - SickDayDate.getDate() <= 3) {
              flag = true; //Ican accept annual leave
            }
          }
          if (x2.getMonth() - SickDayDate.getMonth() == 1) {
            var daysInCurrentMonth = new Date(SickDayDate.getFullYear(), SickDayDate.getMonth(), 0).getDate();

            if (daysInCurrentMonth - SickDayDate.getDate() + x2.getDate <= 3) {
              flag = true;
            }
          }
        }
        if (x2.getFullYear() > SickDayDate.getUTCFullYear()) {
          if (SickDayDate.getMonth() == 11 && x2.getMonth() == 0) {
            var daysInCurrentMonth = new Date(SickDayDate.getFullYear(), SickDayDate.getMonth(), 0).getDate();
            if (daysInCurrentMonth - SickDayDate.getDate() + x2.getDate <= 3) {
              flag = true;
            }
          } else flag = true;
        }
        if (!flag) {
          return res.send({ error: 'Sorry you Cannot submit this Request' });
        }

        const document = req.body.document;
        if (!document) {
          return res.send({ error: 'please enter all data' });
        }
        const subject = type + ' (' + leaveType + ') at ' + req.body.SickDayDate;

        const newRequest = new Request({
          //TODO a4eel el sender
          sender: sender,
          reciever: rec,
          type: type,
          leavetype: leaveType,
          SickDayDate: SickDayDate,

          document: document,
          reason: reason,
          subject: subject,
        });
        await newRequest.save();
        return res.send({ data: newRequest });
      }
      if (leaveType == 'Compensation') {
        const cdate = req.body.CompensationDate;
        const CompensationDate = new Date(Date.parse(req.body.CompensationDate)); //date
        const LeaveDate = new Date(Date.parse(req.body.LeaveDate));
        const reason = req.body.reason;

        //date
        if (!CompensationDate || !LeaveDate || !reason) {
          return res.send({ error: 'please enter all data in a correct way' });
        }
        var flag = false;

        if (LeaveDate.getFullYear() < CompensationDate.getFullYear()) {
          if (LeaveDate.getMonth() == 11 && CompensationDate.getMonth() == 0) {
            if (LeaveDate.getDate() > 11 && CompensationDate.getDate() < 10) {
              flag = true;
            }
          } else {
            flag = true;
          }
        } else {
          if (LeaveDate.getFullYear() == CompensationDate.getFullYear()) {
            if (LeaveDate.getMonth() == CompensationDate.getMonth()) {
              if (CompensationDate.getDate() > LeaveDate.getDate()) {
                flag = true;
              }
            }
            if (LeaveDate.getMonth() < CompensationDate.getMonth()) {
              if (LeaveDate.getDate() > 11 && CompensationDate.getDate() < 10) {
                flag = true;
              }
            }
          }
        }
        if (!flag) {
          return res.send({ error: 'Sorry you Cannot submit this Request' });
        }
        const AttendanceRecord = sender.attendanceRecords;

        var record;
        var recordDay;

        var recdate;
        var f3;
        for (i = 0; i < AttendanceRecord.length; i++) {
          if (AttendanceRecord[i].date == cdate) {
            record = AttendanceRecord[i].date;
            recdate = new Date(Date.parse(record));
            recordDay = recdate.getDay();
            f3 = true;
            break;
          }
        }

        var Day;
        switch (recordDay) {
          case 1:
            Day = 'Monday';
            break;
          case 2:
            Day = 'Tuesday';
            // code block
            break;
          case 3:
            Day = 'Wednesday';
            // code block
            break;
          case 4:
            Day = 'Thursday';
            // code block
            break;
          case 5:
            Day = 'Friday';
            // code block
            break;
          case 6:
            Day = 'Saturday';
            // code block
            break;
          case 0:
            Day = 'Sunday';
            // code block
            break;
        }

        if (Day != sender.dayOff) {
          return res.send({ error: 'Sorry you Cannot submit this Request' });
        }
        // search in his requests that there is no compansation    request of the same day
        var f1 = false;
        const request = await Request.findOne({ date: CompensationDate, sender: sender });
        if (request) {
          const leavetype = request.leaveType;
          if (leavetype && request.leavetype == 'Compensation') {
            f1 = true;
          }
        }
        if (f1) {
          return res.send({ error: 'Sorry you Cannot submit this Request' });
        }
        const subject = type + ' (' + leaveType + ') at ' + req.body.CompensationDate;
        const newRequest = new Request({
          //TODO a4eel el sender
          sender: sender,
          reciever: rec,
          type: type,
          leavetype: leaveType,
          CompensationDate: CompensationDate,
          LeaveDate: LeaveDate,
          reason: reason,
          subject: subject,
        });
        await newRequest.save();
        return res.send({ data: newRequest });
      }

      if (leaveType == 'Annual') {
        var reason = req.body.reason;
        if (!reason) {
          reason = '';
        }
        //should be submitted before targeted day
        const x = req.body.AnnualLeaveDate;
        const AnnualLeaveDate = new Date(Date.parse(x));
        const replacment = req.body.rep;

        if (!AnnualLeaveDate) {
          return res.send({ error: 'please enter all data in a Right way ' });
        }

        for (i = 0; i < replacment.length; i++) {
          var object = replacment[i];
          if (!object.id || !object.date || !object.courseName) {
            return res.send({ error: 'please enter all data' });
          }

          const objectDate = new Date(Date.parse(object.date));
          const rec = await StaffMember.findOne({ gucId: object.id }).populate();
          const course = await Course.findOne({ name: courseName }).populate();
          if (!objectDate || !rec || !course) {
            return res.send({ error: 'please enter correct replacement data' });
          }
        }
        if (objectDate.getFullYear() != AnnualLeaveDate.getFullYear() || objectDate.getMonth() != AnnualLeaveDate.getMonth() || objectDate.getDate() != AnnualLeaveDate.getDate()) {
          return res.send({ error: 'Sorry you Cannot submit this Request: Wrong Date' });
        }

        foundReplacmentRequest = await Request.findOne(
          //a7ot status tany
          { type: 'Replacement Request', reciever: rec, status: 'accepted', sender: sender, replacemntDate: objectDate }
        );
        if (!foundReplacmentRequest) {
          return res.send({ error: 'Sorry you Cannot submit this Request: it is not an accepted replacment' });
        }

        var flag = false;
        const x1 = new Date(Date.now());
        if (AnnualLeaveDate.getFullYear() == x1.getFullYear()) {
          if (AnnualLeaveDate.getMonth() == x1.getMonth()) {
            if (AnnualLeaveDate.getDate() > x1.getDate()) {
              flag = true; //Ican accept annual leave
            }
          }
          if (AnnualLeaveDate.getMonth() > x1.getMonth()) {
            flag = true;
          }
        }
        if (AnnualLeaveDate.getFullYear() > x1.getFullYear()) {
          flag = true;
        }
        if (!flag) {
          return res.send({ error: 'Sorry you Cannot submit this Request' });
        }
        const subject = type + ' (' + leaveType + ') at ' + req.body.AnnualLeaveDate;

        const newRequest = new Request({
          //TODO a4eel el sender
          sender: sender,
          reciever: rec,
          type: type,
          leavetype: leaveType,
          AnnualLeaveDate: AnnualLeaveDate,
          replacments: replacment,
          reason: reason,
          subject: subject,
        });
        await newRequest.save();
        return res.send({ data: newRequest });
      }
      if (leaveType == 'Maternity') {
        if (sender.gender != 'female') {
          return res.send({ error: 'Sorry you Cannot submit this Request' });
        }
        var reason = req.body.reason;
        if (!reason) {
          reason = '';
        }
        const doc = req.body.document;
        const startDate = new Date(Date.parse(req.body.startDate));
        if (!doc || !startDate) {
          return res.send({ error: 'Please enter all data in a correct way' });
        }

        const subject = type + ' (' + leaveType + ') at ' + req.body.startDate;

        const newRequest = new Request({
          //TODO a4eel el sender
          sender: sender,
          reciever: rec,
          type: type,
          leavetype: leaveType,
          startDate: startDate,
          document: doc,
          reason: reason,
          subject: subject,
        });
        await newRequest.save();
        return res.send({ data: newRequest });
      }
      if (leaveType == 'Accidental') {
        var reason = req.body.reason;
        if (!reason) {
          reason = '';
        }
        if (sender.leaveBalance == 0) {
          return res.send({ error: 'Sorry you cannot your balance is 0' });
        }
        const AccidentDate = new Date(Date.parse(req.body.AccidentDate));
        if (!AccidentDate) {
          return res.send({ error: 'Please enter all data in a correct way' });
        }
        const subject = type + ' (' + leaveType + ') at ' + req.body.AccidentDate;
        // add status and dender
        const Arr = await Request.find({ type: 'Leave Request', leavetype: 'Accidental', sender: sender, status: 'accepted' });
        //var lucky = await Request.filter({type:"Leave Request" ,leaveType:"Accidental"  });

        const numberOfDays = Arr.length;
        if (numberOfDays > 6) {
          return res.send({ error: "sorry you cann't take more than 6 days" });
        }
        const newRequest = new Request({
          //TODO a4eel el sender
          sender: sender,
          reciever: rec,
          type: type,
          leavetype: leaveType,
          AccidentDate: AccidentDate,

          reason: reason,
          subject: subject,
        });
        await newRequest.save();
        return res.send({ data: newRequest });
      } else {
        return res.send({ error: 'There is no such a leave request ' });
      }
    } else {
      return res.send({ error: 'There is no such a request ' });
    }
  } catch (err) {
    // const NewRequest = await Request.post(senderID,recieverId,req.body);

    console.log('~ err', err);
    return res.send({ err: err });
  }
};

// exports.viewmyReequestsById= async function (req, res) {
//   try{
//   console.log("hereee");
//   var  senderId=req.user.gucId;
//   var sender= await StaffMember.find({gucId:senderId}).populate();
//   //var date=new Date(Date.parse(req.params.date))
//   var ObjectId=req.params._id;
//   console.log("hereee"+ObjectId);
//   var searchQuery = await Request.findOne({ObjectId:ObjectId}).populate()
//   console.log(searchQuery);
//   return res.send({data: searchQuery  });
//   }
//     catch (err) {
//         console.log(err)
//         return res.send({ err: err })
//     }

// }

exports.AcceptOrRejectRep = async function (req, res) {
  try {
    const Requestid = req.params._id;

    var NewRequest = await Request.findOne({ _id: Requestid, reciever: req.user }).populate();
    if (!NewRequest) {
      return res.send({ error: 'there is no request with this id' });
    }
    var id = req.user.gucId;
    var objId = req.user._id;
    var staff = await StaffMember.findOne({ gucId: id }).populate();
    var accepted = false;

    const AcceptOrReject = req.body.AcceptOrReject;
    if (!AcceptOrReject) {
      return res.send({ error: 'please enter AcceptOrReject ' });
    }
    if (AcceptOrReject == 'accepted') {
      var date = NewRequest.replacemntDate;
      const teachingCoursesObjIDs = staff.courses;
      var flag = false;
      teachingCourses = [];

      for (i = 0; i < teachingCoursesObjIDs.length; i++) {
        const teachingCourse = await Course.findById(teachingCoursesObjIDs[i]);
        if (!teachingCourse) {
          return 'You do not have the access to view any courses';
        }
        teachingCourses.push(teachingCourse);
      }
      //The original schedule
      for (j = 0; j < teachingCourses.length; j++) {
        courseSlots = teachingCourses[j].slots;
        for (i = 0; i < courseSlots.length; i++) {
          if (courseSlots[i].isAssigned && courseSlots[i].isAssigned.equals(objId)) {
            if (courseSlots[i].time.getDay() == date.getDay() && courseSlots[i].time.getHours() == date.getHours() && courseSlots[i].time.getMinutes() == date.getMinutes()) {
              flag = true; /// a3ml reject
            }
          }
        }
      }
      if (flag) {
        return res.send({ error: 'you cannot accept this request, you donnot have this free slot in your Schedule' });
      } else {
        accepted = true;
      }
    }
    if (AcceptOrReject == 'rejected') {
      accepted = false;
    } else {
      return res.send({ error: 'enter accepted or rejected please' });
    }

    if (accepted) {
      var senderId = NewRequest.sender._id;

      var sender = await StaffMember.findOne({ _id: senderId }).populate();
      NewRequest.status = 'accepted';
      //update the schedule of the Reciever

      //notification

      const newNotificatin = new Notification({
        reciever: sender,
        message: '  your' + NewRequest.subject + 'was Accepted',
      });
      await newNotificatin.save();
      await NewRequest.save();
      await sender.save();
    } else {
      const newNotificatin = new Notification({
        reciever: sender,
        message: '  your' + NewRequest.subject + 'was Rejected',
      });
      await newNotificatin.save();
      // updates
      NewRequest.status = 'rejected';
      await NewRequest.save();
    }

    return res.send({ data: NewRequest });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};

exports.AcceptOrRejectChangeDay = async function (req, res) {
  try {
    const Requestid = req.params._id;

    var NewRequest = await Request.findOne({ _id: Requestid, reciever: req.user }).populate();
    var accepted = false;
    if (!NewRequest) {
      return res.send({ error: 'there is no request with this id' });
    }

    if (accepted) {
      // updates

      NewRequest.status = 'accepted';
      var senderId = NewRequest.sender._id;
      var sender = await StaffMember.findOne({ _id: senderId }).populate();

      sender.dayOff = NewRequest.newDayOff;
      await sender.save();
      await NewRequest.save();

      //notification
      const newNotificatin = new Notification({
        reciever: sender,
        message: '  your Change DayOFF Request was Accepted',
      });
      await newNotificatin.save();

      return res.send({ data: NewRequest });
    } else {
      const newNotificatin = new Notification({
        reciever: sender,
        message: '  your' + NewRequest.subject + 'was Rejected',
      });
      await newNotificatin.save();
      // updates
      NewRequest.status = 'rejected';
      await NewRequest.save();
      return res.send({ data: NewRequest });
    }
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};

exports.AcceptOrRejectSlot = async function (req, res) {
  try {
    const Requestid = req.params._id;
    var NewRequest = await Request.findOne({ _id: Requestid, reciever: req.user }).populate();
    var accepted = false;
    if (!NewRequest) {
      return res.send({ error: 'there is no request with this id' });
    }

    if (accepted) {
      // updates
      NewRequest.status = 'accepted';
      var senderId = NewRequest.sender._id;
      var sender = await StaffMember.findOne({ _id: senderId }).populate();
      // update the schedule of the sender hereee

      await sender.save();
      await NewRequest.save();
      const newNotificatin = new Notification({
        reciever: sender,
        message: '  your  Slot Request at' + NewRequest.date + ' was Accepted',
      });
      await newNotificatin.save();
    } else {
      const newNotificatin = new Notification({
        reciever: sender,
        message: '  your' + NewRequest.subject + 'was Rejected',
      });
      await newNotificatin.save();
      // updates
      NewRequest.status = 'rejected';
      await NewRequest.save();
    }
    return res.send({ data: NewRequest });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};
exports.AcceptOrRejectLeave = async function (req, res) {
  try {
    const Requestid = req.params._id;
    var NewRequest = await Request.findOne({ _id: Requestid, reciever: req.user }).populate();
    var accepted = false;
    if (!NewRequest) {
      return res.send({ error: 'there is no request with this id' });
    }

    if (accepted) {
      // updates
      NewRequest.status = 'accepted';
      var senderId = NewRequest.sender._id;
      var sender = await StaffMember.findOne({ _id: senderId }).populate();
      //update leave balance of the sender

      const newNotificatin = new Notification({
        reciever: sender,
        message: '  your' + NewRequest.subject + 'was Accepted',
      });
      await newNotificatin.save();
      if (NewRequest.leaveType == 'Sick') {
        const attendanceRecord = staff.attendanceRecords;

        const newAttendance = {
          day: NewRequest.SickDayDate.getDay(),
          date: NewRequest.SickDayDate.getFullYear() + '-' + (NewRequest.SickDayDate.getMonth() + 1) + '-' + NewRequest.SickDayDate.getDate(),
          // startTime:
          //     currentTime.getHours() +
          //     ':' +
          //     currentTime.getMinutes() +
          //     ':' +
          //     currentTime.getSeconds(),
          status: 'Absent',
          absentsatisfied: true,
          absentStatus: 'Sick Leave',
        };
        attendanceRecord.push(newAttendance);
      }
      if (NewRequest.leaveType == 'Compensation') {
        const attendanceRecord = staff.attendanceRecords;

        const newAttendance = {
          day: NewRequest.LeaveDate.getDay(),
          date: NewRequest.LeaveDate.getFullYear() + '-' + (NewRequest.LeaveDate.getMonth() + 1) + '-' + NewRequest.LeaveDate.getDate(),
          // startTime:
          //     currentTime.getHours() +
          //     ':' +
          //     currentTime.getMinutes() +
          //     ':' +
          //     currentTime.getSeconds(),
          status: 'Absent',
          absentsatisfied: true,
          absentStatus: 'Compensation Leave',
        };
        attendanceRecord.push(newAttendance);
      }
      if (NewRequest.leaveType == 'Annual') {
        const attendanceRecord = staff.attendanceRecords;

        const newAttendance = {
          day: NewRequest.AnnualLeaveDate.getDay(),
          date: NewRequest.AnnualLeaveDate.getFullYear() + '-' + (NewRequest.AnnualLeaveDate.getMonth() + 1) + '-' + NewRequest.AnnualLeaveDate.getDate(),
          // startTime:
          //     currentTime.getHours() +
          //     ':' +
          //     currentTime.getMinutes() +
          //     ':' +
          //     currentTime.getSeconds(),
          status: 'Absent',
          absentsatisfied: true,
          absentStatus: 'Annual Leave',
        };
        attendanceRecord.push(newAttendance);
      }
      if (NewRequest.leaveType == 'Maternity') {
        const attendanceRecord = staff.attendanceRecords;

        const newAttendance = {
          day: NewRequest.startDate.getDay(),
          date: NewRequest.startDate.getFullYear() + '-' + (NewRequest.startDate.getMonth() + 1) + '-' + NewRequest.startDate.getDate(),
          // startTime:
          //     currentTime.getHours() +
          //     ':' +
          //     currentTime.getMinutes() +
          //     ':' +
          //     currentTime.getSeconds(),
          status: 'Absent',
          absentsatisfied: true,
          absentStatus: 'Maternity Leave',
        };
        attendanceRecord.push(newAttendance);
      }
      if (NewRequest.leaveType == 'Accidental') {
        const attendanceRecord = staff.attendanceRecords;

        const newAttendance = {
          day: NewRequest.AccidentDate.getDay(),
          date: NewRequest.AccidentDate.getFullYear() + '-' + (NewRequest.AccidentDate.getMonth() + 1) + '-' + NewRequest.AccidentDate.getDate(),
          // startTime:
          //     currentTime.getHours() +
          //     ':' +
          //     currentTime.getMinutes() +
          //     ':' +
          //     currentTime.getSeconds(),
          status: 'Absent',
          absentsatisfied: true,
          absentStatus: 'Accidental Leave',
        };
        attendanceRecord.push(newAttendance);
      }

      await sender.save();
      await NewRequest.save();
    } else {
      const newNotificatin = new Notification({
        reciever: sender,
        message: '  your' + NewRequest.subject + 'was Rejected',
      });
      await newNotificatin.save();
      // updates
      NewRequest.status = 'rejected';
      await NewRequest.save();
    }
    return res.send({ data: NewRequest });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};
exports.CancelRequest = async function (req, res) {
  try {
    var senderId = req.user.gucId;
    var sender = await StaffMember.findOne({ gucId: senderId });

    var id = req.params._id;
    var searchQuery = await Request.findOne({ _id: id, sender: sender }).populate();
    if (!searchQuery) {
      return res.send({ error: 'there is no such a request' });
    }
    //  console.log(searchQuery.sender+"ayaaa");
    //   console.log(sender);
    // if(!(sender._id==searchQuery.sender)){
    //    return res.send({error:" Soryy you cannot "})
    // //el mafrood el case deh mosta7eel t7sl kda kda

    // }
    if (!(searchQuery.status == 'pending')) {
      return res.send({ error: ' Soryy you cannot cancel this request' });
    }
    await Request.deleteOne({ _id: id });
    return res.send({ data: 'Request deleted successfully' });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};
exports.viewmyReequestsByStatus = async function (req, res) {
  try {
    var senderId = req.user.gucId;
    var sender = await StaffMember.findOne({ gucId: senderId }).populate();
    if (req.params.status != 'pending' || req.params.status != 'accepted' || req.params.status != 'rejected') {
      return res.send({ data: 'there is no such a status' });
    }
    var searchQuery = await Request.find({ sender: sender, status: req.params.status }).populate();

    return res.send({ data: searchQuery });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};
exports.viewmyReequestsByType = async function (req, res) {
  try {
    var senderId = req.user.gucId;
    var sender = await StaffMember.findOne({ gucId: senderId }).populate();

    if (req.params.type != 'Replacement Request' || req.params.type != 'Slot Request' || req.params.type != 'Change DayOff' || req.params.type != 'Leave Request') {
      return res.send({ data: 'there is no such a type' });
    }
    var searchQuery = await Request.find({ sender: sender, type: req.params.type }).populate();

    return res.send({ data: searchQuery });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};
exports.viewRecievedReplacementRequest = async function (req, res) {
  try {
    var recId = req.user.gucId;
    var rec = await StaffMember.findOne({ gucId: recId }).populate();
    ////if(!req.params){

    var searchQuery = await Request.find({ reciever: rec, type: 'Replacement Request' }).populate();

    return res.send({ data: searchQuery });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};
exports.viewRecievedRequest = async function (req, res) {
  try {
    var recId = req.user.gucId;
    var rec = await StaffMember.findOne({ gucId: recId }).populate();
    if (req.params.type != 'Change DayOff' || req.params.type != 'Leave Request') {
      return res.send({ data: 'there is no such a type' });
    }
    var searchQuery = await Request.find({ reciever: rec, type: req.params.type }).populate();
    return res.send({ data: searchQuery });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};
exports.viewSlotRequest = async function (req, res) {
  try {
    var recId = req.user.gucId;
    var rec = await StaffMember.findOne({ gucId: recId }).populate();
    var searchQuery = await Request.find({ reciever: rec, type: 'Slot Request' }).populate();
    return res.send({ data: searchQuery });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};
exports.viewNotification = async function (req, res) {
  try {
    var recId = req.user.gucId;
    var rec = await StaffMember.findOne({ gucId: recId }).populate();

    var searchQuery = await Notification.find({ reciever: rec }).populate(); //or something
    return res.send({
      data: searchQuery.map((Notification) => {
        return {
          Notification: Notification.message,
        };
      }),
    });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};
exports.viewmyRequests = async function (req, res) {
  try {
    var senderId = req.user.gucId;
    var sender = await StaffMember.findOne({ gucId: senderId }).populate();
    ////if(!req.params){
    console.log(sender);
    var searchQuery = await Request.find({ sender: sender }).populate(); //or something
    //var Arr=[];
    // for(i=0;i<searchQuery.length;i++){
    // Arr[i]=searchQuery[i].subject
    // }
    return res.send({ data: searchQuery });
    //}
    // else{

    //   var ObjectId=req.params.id;
    //  console.log("hnaa "+ObjectId);
    //   var searchQuery = await Request.findOne({ObjectId:ObjectId}).populate()
    //   console.log(searchQuery);
    //   return res.send({data: searchQuery  });
    //   }
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};
