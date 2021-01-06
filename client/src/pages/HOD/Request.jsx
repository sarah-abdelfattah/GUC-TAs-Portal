import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../../helpers/axiosCall";
import { link } from "../../helpers/constants.js";
import Fade from "react-reveal/Fade";
import { dateFormat } from "../../helpers/constants.js";


function Request(props) {
  const [request, setRequest] = useState([]); //table data
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
            `${link}/requests/viewRequest/${props.match.params.id}`,
          );
          console.log(response)
          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "warning",
              autoDismiss: true,
            });
          } else {
            let data = response.data.data
            setRequest(data);
          }
        } catch (err) {
          console.log("~ err", err);
          //document.location.href = "/unauthorized";
        }
      }
      fetchData();
    }
  }, []);

  return (
    <div className="my-table">
      <Fade>
        <h3 className="general-header">Requests</h3>
        <hr className="general-line" />
        <Grid container spacing={1}>
          <Grid item xs={8}>

          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}
export default Request;
