import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../../helpers/axiosCall";
import { link } from "../../helpers/constants.js";
import Fade from "react-reveal/Fade";

function ViewCourseCoverage() {
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
            `${link}/departments/viewCourseCoverage`
          );
          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "warning",
              autoDismiss: true,
            });
          } else {
            let data = response.data.data;
            setData(data);
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
    <div>
      <Fade>
        <h3 className="general-header">View course coverage</h3>
        <hr className="general-line" />
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <MaterialTable
              title=""
              columns={[
                { title: "Course name", field: "course" },
                { title: "Coverage %", field: "coverage" },
              ]}
              data={data}
              options={{
                headerStyle: {
                  backgroundColor: "#045CC8",
                  color: "#FFF",
                },
              }}
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}
export default ViewCourseCoverage;
