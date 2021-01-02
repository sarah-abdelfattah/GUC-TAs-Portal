import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axiosCall from "../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";

import {
  FormControl,
  InputLabel,
  Input,
  Select,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";

function DeleteLocation() {
  const [rooms, setRooms] = useState({ rooms: [] });
  const [roomChosen, setRoomChosen] = useState("");
  const [capacity, setRoomCapacity] = useState("");
  const [type, setRoomType] = useState("");

  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const result = await axiosCall("get", "locations/room/all");
      setRooms(result.data.data);
    }
    fetchData();
  }, [roomChosen]);

  const handleOnChange = (target) => {
    setRoomChosen(target.value);
    const roomRes = rooms.find(({ _id }) => _id === target.value);
    setRoomCapacity(roomRes.capacity);
    setRoomType(roomRes.type);
  };

  const handleSubmit = async () => {
    try {
      let name;
      if (rooms)
        name = await rooms.find(({ _id }) => _id === roomChosen).location;

      const body = {
        location: name,
      };

      const res = await axiosCall("delete", "locations/location", body);

      if (res.data.data) {
        addToast(res.data.data, {
          appearance: "success",
          autoDismiss: true,
        });

        setRoomChosen("");
        setRoomCapacity("");
        setRoomType("");
      }

      if (res.data.error) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (err) {
      console.log("~err: ", err);
    }
  };

  return (
    <div className="crud-inner-container">
      <div className="crud-form">
        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Location</InputLabel>
          <Select
            className="crud-select"
            value={roomChosen}
            onChange={(event) => {
              handleOnChange(event.target);
            }}
          >
            {rooms.length > 0 &&
              rooms.map((room) => (
                <MenuItem
                  className="crud-menuItem"
                  value={room._id}
                  key={room._id}
                >
                  {room.type} - {room.location}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText className="crud-helperText">
            This field is required
          </FormHelperText>
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">Capacity</InputLabel>
          <Input
            className="crud-input"
            type="number"
            min="1"
            value={capacity}
            disabled={true}
          />
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">Type</InputLabel>
          <Input className="crud-input" value={type} disabled={true} />
        </FormControl>
      </div>

      <Button
        variant="danger"
        className="crud-submit crud-delete-btn red"
        disabled={roomChosen === "" ? true : false}
        onClick={handleSubmit}
      >
        Delete Location
      </Button>
    </div>
  );
}

export default DeleteLocation;
