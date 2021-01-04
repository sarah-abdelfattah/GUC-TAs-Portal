import React from "react";
import AttendanceRecord from "../components/AttendanceRecord";

function MyAttendanceRecord() {
  return (
    <div className="myAttendanceRecord-container">
      <h4 className="title">My Attendance Record</h4>
      <div className="myAttendanceRecord-inner-container">
        <div className="full-record">
          <h4>Full Records</h4>

          <AttendanceRecord
            day="Saturday"
            date="20/12/2020"
            startTime="23:00"
            endTime="22:00"
            status="Present"
          />

          <AttendanceRecord day="Saturday" date="20/12/2020" status="Absent" />
        </div>
        <div className="missing-record">
          <h4>Missing Sign In/Out</h4>
          <AttendanceRecord
            day="Saturday"
            date="20/12/2020"
            startTime="23:00"
            endTime=""
            status="Present"
          />
        </div>
      </div>
    </div>
  );
}

export default MyAttendanceRecord;
