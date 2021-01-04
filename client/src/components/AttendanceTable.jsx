import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../helpers/axiosCall";
import { link } from "../helpers/constants.js";
import { Button } from "@material-ui/core";
import Fade from "react-reveal/Fade";
import checkLogin from "../helpers/checkLogin";

function AttendanceTable(props) {
  const [data, setData] = useState([]); //table data
  const { addToast } = useToasts();

  const compare = (a, b) => {
    const rec1 = a.date;
    const rec2 = b.date;

    let comparison = 0;
    if (rec1 < rec2) {
      comparison = 1;
    } else if (rec1 > rec2) {
      comparison = -1;
    }
    return comparison;
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = "/login";
    } else {
      async function fetchData() {
        try {
          let staff;
          if (!props.hr) {
            let user = await checkLogin();
            staff = await axiosCall("get", `staffMembers/all/${user.gucId}`);
          } else {
          }

          if (staff.data.data) {
            let records = staff.data.data.attendanceRecords;

            //sorted .. from most to least recent
            const result = records.sort(compare);
            setData(result);
          } else {
            addToast(staff.data.error, {
              appearance: "danger",
              autoDismiss: true,
            });
          }
        } catch (err) {
          console.log("~ err", err);
        }
      }
      fetchData();
    }
  }, [props]);

  return (
    <div>
      <Fade>
        <h3 className="general-header">{props.title}</h3>
        <hr className="general-line" />
        <Grid container spacing={1}>
          <Grid item xs={11}>
            <MaterialTable
              title=""
              columns={[
                { title: "Day", field: "day" },
                { title: "Date", field: "date" },
                { title: "Sign In", field: "startTime" },
                { title: "Sign Out", field: "endTime", sorting: false },
                { title: "leave", field: "absentsatisfied", sorting: false },
                {
                  title: "Absent Status",
                  field: "absentStatus",
                  sorting: false,
                },
                { title: "Description", field: "description", sorting: false },
              ]}
              align="center"
              data={data}
              options={{
                sorting: true,
                actionsColumnIndex: -1,
                headerStyle: {
                  backgroundColor: "#FFF",
                  color: "#000",
                  letterSpacing: "0.1em",
                  fontSize: "18px",
                  margin: "0",
                  padding: "0 0 10px 0",
                },
                rowStyle: {
                  fontSize: "15px",
                },
              }}
              components={{
                Action: (props) => (
                  <Button
                    onClick={(event) => props.action.onClick(event, props.data)}
                    variant="contained"
                    style={{
                      textTransform: "none",
                      background: "#045CC8",
                      color: "#fff",
                    }}
                    size="small"
                  >
                    Attendance
                  </Button>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}

export default AttendanceTable;
