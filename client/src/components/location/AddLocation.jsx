import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axiosCall from "../../helpers/axiosCall";
import {
  FormControl,
  InputLabel,
  Input,
  Select,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";

function AddLocation() {
  const [type, setRoomType] = useState("");
  const [location, setRoomLocation] = useState("");
  const [capacity, setRoomCapacity] = useState("");

  const handleSubmit = () => {
    console.log("hi");
  };

  return (
    <div className="crud-inner-container">
      <div className="crud-form">
        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Type</InputLabel>
          <Select
            className="crud-select"
            value={type}
            onChange={(event) => {
              setRoomType(event.target.value);
            }}
          >
            <MenuItem className="crud-menuItem" value="Lab">
              Lab
            </MenuItem>
            <MenuItem className="crud-menuItem" value="Office">
              Office
            </MenuItem>
            <MenuItem className="crud-menuItem" value="Lecture Hall">
              Lecture Hall
            </MenuItem>
            <MenuItem className="crud-menuItem" value="Tutorial Room">
              Tutorial Room
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Location</InputLabel>
          <Input className="crud-input" />
        </FormControl>

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Capacity</InputLabel>
          <Input className="crud-input" type="number" min="1" />
        </FormControl>
      </div>

      <Button className="crud-submit green" onClick={handleSubmit}>
        Add Location
      </Button>
    </div>
  );
}

export default AddLocation;
