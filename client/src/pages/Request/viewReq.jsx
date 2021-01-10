import React, { useState, useEffect } from "react";
import { link } from "../../helpers/constants.js";
import axiosCall from "../../helpers/axiosCall";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "react-avatar";
import Typography from "@material-ui/core/Typography";
import { useToasts, addToast } from "react-toast-notifications";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Popper from "@material-ui/core/Popper";
import TextField from "@material-ui/core/TextField";

import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    fontSize: 20,
    borderRadius: 10,
    padding: "2%",
    width: 500,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: "5%",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    margin: "auto",
  },
  margin: {
    margin: "auto",
  },
  text: {
    margin: theme.spacing(1),
    fontSize: 18,
  },
}));
function ViewReq(props) {
  const [request, setRequest] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = "/login";
    } else {
      async function fetchData() {
        try {
          const response = await axiosCall(
            "get",
            `${link}/requests/viewReq/${props.match.params.id}`
          );
          console.log(response);
          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            let req = response.data.data.request;
            setRequest(req);
            console.log(req);
            //'Replacement Request', 'Slot Request', 'Change DayOff', 'Leave Request'
            console.log(req.type);
            if (req.type == "Leave Request") {
              setType(req.leavetype);
            }
            if (
              req.type == "Replacement Request" ||
              req.type == "Slot Request" ||
              req.type == "Change DayOff"
            ) {
              setType(req.type);
            }
          }
        } catch (err) {
          console.log("~ err", err);
        }
      }
      fetchData();
    }
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.modal}>
      <Card className={classes.root}>
        <CardContent>
          <Typography
            className={classes.text}
            color="textPrimary"
            component="h6"
            variant="h6"
          >
            Date: {request.date}
          </Typography>
          <Typography
            className={classes.text}
            color="textPrimary"
            component="h6"
            variant="h6"
          >
            Type: {type}
          </Typography>
          {type == "Replacement Request" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Replacemnt Date: {request.replacemntDate}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Location: {request.location}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                coursename: {request.coursename}
              </Typography>
            </div>
          ) : type == "Slot Request" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                coursename:{request.coursename}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Location Type : {request.locationType}
              </Typography>
            </div>
          ) : type == "Change DayOff" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                New DayOff: {request.newDayOff}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason: {request.reason}
              </Typography>
            </div>
          ) : type == "Compensation" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                CompensationDate:{request.CompensationDate}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                LeaveDate: {request.LeaveDate}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Document: {request.document}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason: {request.reason}
              </Typography>
            </div>
          ) : type == "Maternity" ? (
            //startDate: startDate,
            //  document: doc,
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Maternity Date: {request.startDate}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Document: {request.document}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason: {request.reason}
              </Typography>
            </div>
          ) : type == "Accidental" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Accident Date: {request.AccidentDate}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason: {request.reason}
              </Typography>
            </div>
          ) : type == "Annual" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                AnnualLeave Date:{request.AnnualLeaveDate}
              </Typography>

              {request.replacements.reps.map((rep) => (
                <div>
                  Replacements
                  <Typography
                    className={classes.text}
                    color="textPrimary"
                    component="h6"
                    variant="h6"
                  >
                    TA ID:{rep.TAId}
                  </Typography>
                  <Typography
                    className={classes.text}
                    color="textPrimary"
                    component="h6"
                    variant="h6"
                  >
                    time :{rep.time}
                  </Typography>
                  <Typography
                    className={classes.text}
                    color="textPrimary"
                    component="h6"
                    variant="h6"
                  >
                    Course Name:{rep.coursename}
                  </Typography>
                </div>
              ))}

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                AnnualLeave Date:{request.AnnualLeaveDate}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason:{request.reason}
              </Typography>
            </div>
          ) : type == "Sick" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Sick Date:{request.SickDayDate}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Document:{request.document}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason:{request.reason}
              </Typography>
            </div>
          ) : null}

          <Typography
            className={classes.text}
            color="textPrimary"
            component="h6"
            variant="h6"
          >
            status: {request.status}
          </Typography>

          <Typography
            className={classes.text}
            color="textPrimary"
            component="h6"
            variant="h6"
          >
            Subject: {request.subject}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
export default ViewReq;
