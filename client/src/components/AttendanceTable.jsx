import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../helpers/axiosCall";
import Fade from "react-reveal/Fade";
import checkLogin from "../helpers/checkLogin";
import { IoFilter, IoCloseSharp } from "react-icons/io5";
import { Select, MenuItem } from "@material-ui/core";

function AttendanceTable(props) {
  const [staff, setStaff] = useState([]);
  const [HR, setHr] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]); //table data
  const [filtered, setFiltered] = useState(false);
  const [selectedMonth, setMonth] = useState("Month");

  const { addToast } = useToasts();

  const month = [
    "11 Jan - 10 Feb", //0 1-2
    "11 Feb - 10 Mar", //1 2-3
    "11 Mar - 10 Apr", //2 3-4
    "11 Apr - 10 May", //3 4-5
    "11 May - 10 Jun", //4 5-6
    "11 Jun - 10 Jul", //5 6-7
    "11 Jul - 10 Aug", //6 7-8
    "11 Aug - 10 Sep", //7 8-9
    "11 Sep - 10 Oct", //8 9-10
    "11 Oct - 10 Nov", //9 10-11
    "11 Nov - 10 Dec", //10 11-12
    "11 Dec - 10 Jan", //11 12-1
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
      document.location.href = window.location.origin + "/login";
    } else {
      async function fetchData() {
        try {
          let temp = await axiosCall("get", `staffMembers/all/${props.gucId}`);
          let staff = "";
          if (temp.data.data) staff = temp.data.data;

          if (props.hr) setHr(true);

          if (staff) {
            setStaff(staff);
            let records = staff.attendanceRecords;

            //sorted .. from most to least recent
            const result = records.sort(compare);
            setOriginalData(result);
            setData(result);
            // addToast("uploaded", {
            //   appearance: "success",
            //   autoDismiss: true,
            // });
          } else {
            addToast("Error occurred, please try again later", {
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

  const handleFilter = async () => {
    try {
      if (selectedMonth === "Month") {
      } else {
        setFiltered(true);
        let term = parseInt(month.indexOf(selectedMonth));
        if (term > -1) {
          let month1 = term + 1;
          let month2;
          if (month1 === 12) month2 = 1;
          else month2 = month1 + 1;

          const res = await axiosCall(
            "get",
            `attendance/viewAttendance/${month1}/${month2}`
          );

          addToast("filtered successfully", {
            appearance: "success",
            autoDismiss: true,
          });

          return setData(res.data);
        } else {
          addToast("Sorry this is not a valid month", {
            appearance: "danger",
            autoDismiss: true,
          });
        }
      }
    } catch (error) {
      addToast("crashed", {
        appearance: "danger",
        autoDismiss: true,
      });
    }
  };

  const handleRemoveFilter = async () => {
    setData(originalData);
    setFiltered(false);
    setMonth("");
  };

  const handleRowUpdate = async (newData, oldData) => {
    //changed endTime
    const filtered = originalData.filter((rec) => rec.date === oldData.date);
    let numberHere = 0;
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i]._id === oldData._id) {
        numberHere = i + 1;
        break;
      }
    }

    if (newData.startTime === oldData.startTime) {
      const index = oldData.tableData.id;
      const dataUpdate = [...data];
      dataUpdate[index] = newData;
      // setOriginalData([...dataUpdate]);
      if (!newData.endTime) console.log("please enter some info");
      else {
        if (newData.endTime.length !== 8) {
          addToast("Time should be in the format of: HH:MM:SS", {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          const body = {
            id: staff.gucId,
            signOut: newData.endTime,
            date: oldData.date,
            day: oldData.day,
            number: parseInt(numberHere),
          };

          const res = await axiosCall(
            "put",
            "attendance/addMissingSignInOut",
            body
          );
          console.log(
            "🚀 ~ file: AttendanceTable.jsx ~ line 165 ~ handleRowUpdate ~ res",
            res
          );

          if (res.data.error) {
            addToast(res.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          }

          let temp = await axiosCall("get", `staffMembers/all/${props.gucId}`);
          let staffUpdated = "";
          if (temp.data.data) staffUpdated = temp.data.data;

          if (staffUpdated) {
            let records = staffUpdated.attendanceRecords;

            //sorted .. from most to least recent
            const result = records.sort(compare);

            setOriginalData(result);
            setData(result);
          } else {
            addToast("Error occurred, please try again later", {
              appearance: "error",
              autoDismiss: true,
            });
          }
        }
      }
    } else {
    }
  };

  const handleRowAdd = (newData) => {};

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
                {
                  title: "Day",
                  field: "day",
                  filtering: false,
                  editable: false,
                },
                {
                  title: "Date",
                  field: "date",
                  editable: false,
                },
                {
                  title: "Sign In",
                  field: "startTime",
                  filtering: false,
                },
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
                  editable: false,
                },
                {
                  title: "Absent Status",
                  field: "absentStatus",
                  sorting: false,
                  filtering: false,
                  editable: false,
                },
                {
                  title: "Description",
                  field: "description",
                  sorting: false,
                  filtering: false,
                  editable: false,
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
                  <div className="select-table-container">
                    <Select
                      className="table-select month"
                      value={selectedMonth}
                      onChange={(event) => setMonth(event.target.value)}
                      placeholder="Month"
                    >
                      <MenuItem className="" value={"Month"} key={"Month"}>
                        Month
                      </MenuItem>
                      {month.map((mon) => (
                        <MenuItem className="" value={mon} key={mon}>
                          {mon}
                        </MenuItem>
                      ))}
                    </Select>

                    <IoFilter
                      className="filter-icon"
                      onClick={() => handleFilter()}
                    />
                    {filtered ? (
                      <IoCloseSharp
                        className="filter-icon"
                        onClick={handleRemoveFilter}
                      />
                    ) : null}
                  </div>
                ),
              }}
              editable={
                HR
                  ? {
                      // handle row add
                      onRowAdd: (newData) =>
                        new Promise((resolve) => {
                          handleRowAdd(newData, resolve);
                        }),

                      //to update row
                      onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                          setTimeout(() => {
                            handleRowUpdate(newData, oldData);
                            resolve();
                          }, 1000);
                        }),
                    }
                  : false
              }
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}

export default AttendanceTable;
