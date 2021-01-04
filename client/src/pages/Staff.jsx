import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../helpers/axiosCall";
import { link } from "../helpers/constants.js";
import { Button } from "@material-ui/core";
import Fade from "react-reveal/Fade";

function Staff() {
  const [data, setData] = useState([]); //table data
  const { addToast } = useToasts();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = "/login";
    } else {
      async function fetchData() {
        try {
          const response = await axiosCall("get", `/staffMembers/all/all`);

          const locations = await axiosCall(
            "get",
            `${link}/locations/room/all`
          );

          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "danger",
              autoDismiss: true,
            });
          } else {
            //get missing hours and days
            const missingRes = await axiosCall(
              "get",
              "attendance/viewStaffMissing"
            );

            let data = await response.data.data.map((staff) => {
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
                missingHours: missingRes.data.data
                  .map((rec) => {
                    if (rec.GUCID === staff.gucId) {
                      return rec.MissingHours;
                    } else return null;
                  })
                  .filter((rec) => rec !== null),
                missingDays: missingRes.data.data
                  .map((rec) => {
                    if (rec.GUCID === staff.gucId) {
                      return rec.MissingDays;
                    } else return null;
                  })
                  .filter((rec) => rec !== null),
              };
            });

            await setData(data);
          }
        } catch (err) {
          console.log("~ err", err);
          //   document.location.href = "/unauthorized";
        }
      }
      fetchData();
    }
  }, [data]);

  const handleDelete = async (gucId) => {
    try {
      const res = await axiosCall("delete", "staffMembers/staff", {
        gucId: gucId,
      });

      if (res.data.data) {
        addToast("Staff deleted successfully", {
          appearance: "success",
          autoDismiss: true,
        });

        // delete from table
        const filtered = await data.filter((staff) => staff.gucId !== gucId);
        setData(filtered);
      }

      if (res.data.error) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      addToast(error, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <div>
      <Fade>
        <h3 className="general-header">Staff Members</h3>
        <hr className="general-line" />
        <Grid container spacing={1}>
          <Grid item xs={11}>
            <MaterialTable
              title=""
              columns={[
                {
                  title: "Avatar",
                  render: (rowData) => (
                    <Avatar
                      maxInitials={1}
                      size={35}
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
                { title: "Missing Days", field: "missingDays" },
                { title: "Missing Hours", field: "missingHours" },
              ]}
              align="center"
              data={data}
              actions={[
                {
                  title: "Delete",
                  icon: "delete",
                  tooltip: "Delete Staff",
                  onClick: (event, rowData) => {
                    handleDelete(rowData.gucId);
                  },
                },
              ]}
              options={{
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
              // components={{
              //   Action: (props) => (
              //     <Button
              //       onClick={(event) => props.action.onClick(event, props.data)}
              //       variant="contained"
              //       style={{
              //         textTransform: "none",
              //         background: "#045CC8",
              //         color: "#fff",
              //       }}
              //       size="small"
              //     >
              //       Attendance
              //     </Button>
              //   ),
              // }}
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}

export default Staff;
