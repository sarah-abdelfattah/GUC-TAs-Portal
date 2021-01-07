import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "react-avatar";
import Typography from "@material-ui/core/Typography";
import { link } from "../../helpers/constants.js";
import axiosCall from "../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import { dateFormat } from "../../helpers/constants.js";
import { Button } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

// modal component
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { AcceptButton, RejectButton } from "../../styles/StyledComponents.js";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    fontSize: 20,
    borderRadius: 10,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    margin: theme.spacing(4),
  },
  margin: {
    margin: theme.spacing(4),
  },
  text: {
    margin: theme.spacing(1),
    fontSize: 18
  },
}));

function Request(props) {
  const [request, setRequest] = useState([]);
  const [date, setDate] = useState([]);
  const [title, setTitle] = useState([]);
  const [sender, setSender] = useState([]);
  const [gucId, setId]= useState([]);
  const { addToast } = useToasts();
  const classes = useStyles();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = "/login";
    } else {
      async function fetchData() {
        try {
          const response = await axiosCall(
            "get",
            `${link}/requests/viewRequest/${props.match.params.id}`
          );
          console.log(response);
          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "warning",
              autoDismiss: true,
            });
          } else {
            let sender = response.data.data.sender;
            setSender(sender);
            let gucId = response.data.data.senderId;
            setId(gucId);
            let date = dateFormat(response.data.data.requestData.date);
            setDate(date);
            let data = response.data.data.requestData;
            setRequest(data);
            if (response.data.data.requestData.type === "Change DayOff") {
              let title = response.data.data.requestData.subject;
              setTitle(title);
            } else {
              let title = response.data.data.requestData.subject.slice(0, 26);
              setTitle(title);
            }
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
    <div className="request-card-center">
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar
                maxInitials={1}
                size={45}
                round={true}
                name={sender}
              />
            }
            title={title}
            subheader={date}
          />
          <CardContent>
            <Typography className={classes.text} color="textPrimary" component="h5" variant="p">
              Sender: {sender}
            </Typography>
            <Typography className={classes.text} color="textPrimary" component="h6" variant="h6">
              Sender ID: {gucId}
            </Typography>
            <Typography className={classes.text} color="textPrimary" component="h6" variant="h6">
              Reason: {request.reason}
            </Typography>
            <Typography className={classes.text} color="textPrimary" component="h6" variant="h6">
              Document: {request.document}
            </Typography>
          </CardContent>
          <CardActions>
            <AcceptButton
              variant="contained"
              color="primary"
              className={classes.margin}
              startIcon={<CheckCircleIcon />}
            >
              {" "}
              Accept
            </AcceptButton>
            <RejectButton
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<CancelIcon />}
            >
              {" "}
              Reject
            </RejectButton>
          </CardActions>
        </Card>
    </div>
  );
}
export default Request;
