import React, { useState, useEffect } from "react";
import checkLogin from "../helpers/checkLogin";
import AttendanceTable from "../components/AttendanceTable";

function MyAttendanceRecord() {
  const [userId, setUserId] = useState("");
  const [data, setData] = useState({ data: [] });

  useEffect(() => {
    async function fetchData() {
      let user = await checkLogin();
      await setUserId(user.gucId);
      console.log(
        "🚀 ~ file: MyAttendanceRecord.jsx ~ line 13 ~ fetchData ~ user.gucId",
        user.gucId
      );
    }
    fetchData();
  }, [userId]);

  return (
    <div>
      <AttendanceTable title="My Attendance Record" gucId={userId} hr={false} />
    </div>
  );
}

export default MyAttendanceRecord;
