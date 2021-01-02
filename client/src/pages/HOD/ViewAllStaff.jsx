import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../../helpers/axiosCall";
import { link } from "../../helpers/constants.js";
import DetailPanel from "../../components/DetailPanel"

function ViewAllStaff() {
  const [data, setData] = useState([]); //table data
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
            `${link}/departments/getAllStaffMembers`
          );
          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "warning",
              autoDismiss: true,
            });
          } else {
            setData(response.data.data);
          }
        } catch (err) {
          console.log("~ err", err);
          document.location.href = "/unauthorized";
        }
      }
      fetchData();
    }
  }, []);

  return (
    // styling
    <Grid container spacing={3}>
      <Grid item xs={2}></Grid>
      <Grid item xs={9}>
        <br />
        <br />
        <br />
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
            { title: "Salary", field: "salary" },
            { title: "office location", field: "officeLocation" },
          ]}
          data={data}
          detailPanel={rowData => {
            {console.log(rowData)}
            return (
              <div>
              <DetailPanel 
                data = {rowData.name}
              />
              </div>
            )
          }}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
        />
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  );
}

export default ViewAllStaff;
