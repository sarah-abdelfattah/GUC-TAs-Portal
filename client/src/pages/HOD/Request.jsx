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

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
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
    margin: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(4),
  },
}));

function Request(props) {
  const [request, setRequest] = useState([]);
  const [date, setDate] = useState([]);
  const [title, setTitle] = useState([]);
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
            let date = dateFormat(response.data.data.date);
            setDate(date);
            let data = response.data.data;
            setRequest(data);
            if (response.data.data.type === "Change DayOff") {
              let title = response.data.data.subject;
              setTitle(title);
            } else {
              console.log("here");
              let title = response.data.data.subject.slice(0, 26);
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open
        //onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar
                maxInitials={1}
                size={43}
                round={true}
                name={request.sender}
              />
            }
            title={title}
            subheader={date}
          />
          <CardContent>
            <Typography color="textPrimary" component="h6" variant="h6">
              Sender: {request.sender}
            </Typography>
            <Typography color="textPrimary" component="h6" variant="h6">
              Sender ID: {request.senderId}
            </Typography>

          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              className={classes.margin}
              startIcon={<CheckCircleIcon />}
            >
              {" "}
              Accept
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<CancelIcon />}
            >
              {" "}
              Reject
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </div>
  );
}
export default Request;
