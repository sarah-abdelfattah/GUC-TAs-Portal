import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../helpers/axiosCall";
import Fade from "react-reveal/Fade";
import checkLogin from "../helpers/checkLogin";
import { IoFilter, IoCloseSharp } from "react-icons/io5";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
} from "@material-ui/core";

//TODO: filter by year -->
//year only with no month
//remove this condition year only with no month
//add condition both cannot be empty
function AttendanceTable(props) {
  const [staff, setStaff] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]); //table data
  const [filtered, setFiltered] = useState(false);
  const [selectedMonth, setMonth] = useState("Month");
  const [selectedYear, setYear] = useState("2021");

  const { addToast } = useToasts();

  const year = [
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
    "2009",
    "2008",
    "2007",
    "2006",
    "2005",
    "2004",
    "2003",
  ];

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
    setYear("2021");
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

                    <Select
                      className="table-select year"
                      value={selectedYear}
                      onChange={(event) => setYear(event.target.value)}
                      placeholder="Year"
                    >
                      {year.map((y) => (
                        <MenuItem className="" value={y} key={y}>
                          {y}
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
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}

export default AttendanceTable;
