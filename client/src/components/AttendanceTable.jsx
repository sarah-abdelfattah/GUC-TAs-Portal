import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../helpers/axiosCall";
import { link } from "../helpers/constants.js";
import { Button } from "@material-ui/core";
import Fade from "react-reveal/Fade";
import checkLogin from "../helpers/checkLogin";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

function AttendanceTable(props) {
  const [staff, setStaff] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]); //table data
  const [filtered, setFiltered] = useState([]);

  const { addToast } = useToasts();

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
            setStaff(staff.data.data);
            let records = staff.data.data.attendanceRecords;

            //sorted .. from most to least recent
            const result = records.sort(compare);
            setOriginalData(result);
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

  const handleFilter = async (inputData) => {
    try {
      let term = parseInt(month.indexOf(inputData));
      if (term > -1) {
        let month1 = term + 1;
        console.log(
          "🚀 ~ file: AttendanceTable.jsx ~ line 89 ~ handleFilter ~ month1",
          month1
        );
        let month2;
        if (month1 === 12) month2 = 1;
        else month2 = month1 + 1;
        console.log(
          "🚀 ~ file: AttendanceTable.jsx ~ line 93 ~ handleFilter ~ month2",
          month2
        );

        // const res = await axiosCall(
        //   "get",
        //   `attendance/viewAttendance/${term}/${month2}`
        // );
        // console.log(
        //   "🚀 ~ file: AttendanceTable.jsx ~ line 77 ~ handleFilter ~ res",
        //   res.data
        // );
        // setFiltered(res.data);
      } else {
        addToast("Sorry this is not a valid month", {
          appearance: "danger",
          autoDismiss: true,
        });
      }
    } catch (error) {}
  };

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
                { title: "Day", field: "day", filtering: false },
                {
                  title: "Date",
                  field: "date",
                  // customFilterAndSearch: (term, rowData) => {
                  //   if (term) {
                  //     console.log("terrmmmm");
                  //     handleFilter(term);
                  //   }
                  // },
                },
                { title: "Sign In", field: "startTime", filtering: false },
                {
                  title: "Sign Out",
                  field: "endTime",
                  sorting: false,
                  filtering: false,
                },
                {
                  title: "leave",
                  field: "absentsatisfied",
                  sorting: false,
                  filtering: false,
                },
                {
                  title: "Absent Status",
                  field: "absentStatus",
                  sorting: false,
                  filtering: false,
                },
                {
                  title: "Description",
                  field: "description",
                  sorting: false,
                  filtering: false,
                },
              ]}
              align="center"
              data={data}
              options={{
                // filtering: true,
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
                Toolbar: (props) => (
                  <Autocomplete
                    size="small"
                    id="debug"
                    options={month}
                    onChange={(event, newValue) => {
                      handleFilter(newValue);
                    }}
                    getOptionLabel={(option) => option}
                    style={{ width: "30%", margin: "auto" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="View attendance of Month: "
                        margin="normal"
                      />
                    )}
                  />
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
