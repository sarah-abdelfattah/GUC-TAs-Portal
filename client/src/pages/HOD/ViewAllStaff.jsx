import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import Avatar from 'react-avatar';
import Grid from '@material-ui/core/Grid'
import axiosCall from '../../helpers/axiosCall'
import { link } from '../../helpers/constants.js';

function ViewAllStaff() {
  const [data, setData] = useState([]); //table data

  useEffect(() => { 
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = "/login";
    }
    else{
      async function fetchData(){
        try{
          const response = await axiosCall("get", `${link}/departments/getAllStaffMembers`);
          setData(response.data.data);
        }
        catch(err){
          console.log(err);
        }
      }
      fetchData();
    }
  }, [])

  return (
    // styling
    <Grid container spacing={3}>
    <Grid item xs={3}></Grid>
    <Grid item xs={7}>
    <br />
    <br />
    <br />
    <br />
    <br />
        {" "}
        <MaterialTable
          title=""
          columns={[
            {title: "Avatar", render: rowData => <Avatar maxInitials={1} size={40} round={true} name={rowData === undefined ? " " : rowData.name} />  },
            { title: "Name", field: "name" },
            { title: "GUC ID", field: "gucId" },
            { title: "Role", field: "role"},
            { title: "Email", field: "email"},
          ]}
          data= {data}
        />
    </Grid>
    <Grid item xs={3}></Grid>
    </Grid>
  );
}

export default ViewAllStaff;
