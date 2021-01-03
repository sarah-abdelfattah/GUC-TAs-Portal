import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../../helpers/axiosCall";
import { link } from "../../helpers/constants.js";
import { Button } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fade from 'react-reveal/Fade';



function ViewAllStaff() {
  const [data, setData] = useState([]); //table data
  const [courses, setCourses] = useState([]); //table data
  const { addToast } = useToasts();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = "/login";
    } else {
      async function fetchData() {
        try {
          const response = await axiosCall(
            "get",
            `${link}/departments/getAllStaffMembers/all`
          );
          const locations = await axiosCall(
            "get",
            `${link}/locations/room/all`
          );
          const courses = await axiosCall(
            "get",
            `${link}/departments/courses`
          );

          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "warning",
              autoDismiss: true,
            });
          } else {
            let data = response.data.data.map((staff) => {
              return {
                name: staff.name,
                gucId: staff.gucId,
                gender: staff.gender,
                email: staff.email,
                role: staff.role,
                salary: staff.salary,
                dayOff: staff.dayOff,
                id: staff._id,
                location: locations.data.data
                  .map((location) => {
                    if (staff.officeLocation === location._id) {
                      return location.location;
                    } else return null;
                  })
                  .filter((location) => location !== null),
              };
            });
            setData(data);
            let data2 = courses.data.data;
            let data3 = data2.push({course:"all"});
            console.log(data3);
            setCourses(data2);
          }
        } catch (err) {
          console.log("~ err", err);
          document.location.href = "/unauthorized";
        }
      }
      fetchData();
    }
  }, []);

  async function handleOnChange(event){
    try{
      const res = await axiosCall(
        "get",
        `${link}/departments/getAllStaffMembers/${event.course}`
      );
      const locations = await axiosCall(
        "get",
        `${link}/locations/room/all`
      );

      let data = res.data.data.map((staff) => {
        return {
          name: staff.name,
          gucId: staff.gucId,
          gender: staff.gender,
          email: staff.email,
          role: staff.role,
          salary: staff.salary,
          dayOff: staff.dayOff,
          id: staff._id,
          location: locations.data.data
            .map((location) => {
              if (staff.officeLocation === location._id) {
                return location.location;
              } else return null;
            })
            .filter((location) => location !== null),
        };
      });
      setData(data);
    }
    catch (err) {
      console.log("~err", err);
    }
  }

  return (
    // styling
    <div>
    <Fade>
      <Grid container spacing={1}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <br />
          <br />
          <MaterialTable
            title=""
            columns={[
              {
                title: "Avatar",
                render: (rowData) => (
                  <Avatar
                    maxInitials={1}
                    size={40}
                    round={true}
                    name={rowData === undefined ? " " : rowData.name}
                  />
                ),
              },
              { title: "Name", field: "name" },
              { title: "Gender", field: "gender" },
              { title: "ID", field: "gucId" },
              { title: "Role", field: "role" },
              { title: "Email", field: "email" },
              { title: "Day off", field: "dayOff" },
              { title: "office", field: "location" },
            ]}
            data={data}
            actions={[
              {
                icon: "save",
                tooltip: "Save User",
                onClick: (event, rowData) => {
                  document.location.href = `${rowData.id}/viewSchedule`;
                },
              },
            ]}
            options={{
              actionsColumnIndex: -1,
            }}
            components={{
              Action: (props) => (
                <Button
                  onClick={(event) => props.action.onClick(event, props.data)}
                  color="primary"
                  variant="contained"
                  style={{ textTransform: "none" }}
                  size="small"
                >
                  View schedule
                </Button>
              ),
              Toolbar: (props) => (
                <Autocomplete
                  size="small"
                  id="debug"
                  options={courses}
                  onChange={(event, newValue) =>{
                    handleOnChange(newValue);
                  }}
                  getOptionLabel={(option) => option.course}
                  style={{ width: "30%",  margin: "auto" }}
                  renderInput={(params) => <TextField {...params} label="View staff members per course" margin="normal" />}
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

export default ViewAllStaff;
