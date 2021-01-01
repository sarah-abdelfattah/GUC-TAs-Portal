import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axiosCall from "../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

import {
  FormControl,
  InputLabel,
  Select,
  Input,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";

function AddFaculty() {
  const [faculties, setFaculties] = useState({ faculties: [] });
  const [facultyChosen, setFacultyChosen] = useState("");
  const [name, setName] = useState("");
  const [HOD, setHOD] = useState("");

  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const result = await axiosCall("get", "faculties/faculty/all");
      // const result = await axios.get(
      //   "http://localhost:5000/faculties/faculty/all",
      //   "",
      //   {
      //     headers: {
      //       Authorization: localStorage.getItem("user"),
      //     },
      //   }
      // );

      // console.log(
      //   "🚀 ~ file: AddDepartment.jsx ~ line 26 ~ fetchData ~ result",
      //   result
      // );
      setFaculties(result.data.data);
    }
    fetchData();
  }, [facultyChosen]);

  const handleSubmit = async () => {
    try {
      let code;
      if (faculties)
        code = await faculties.find(({ _id }) => _id === facultyChosen).code;

      const body = {
        facultyCode: code.toUpperCase(),
        name: name,
        HOD: HOD ? HOD : undefined,
      };

      const res = await axiosCall("post", "departments/department", body);

      if (res.data.data) {
        addToast("Department created successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setHOD("");
        setName("");
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
          <InputLabel className="crud-inputLabel">Faculty</InputLabel>
          <Select
            className="crud-select"
            value={facultyChosen}
            onChange={(event) => {
              setFacultyChosen(event.target.value);
            }}
          >
            {faculties.length > 0 &&
              faculties.map((faculty) => (
                <MenuItem
                  className="crud-menuItem"
                  value={faculty._id}
                  key={faculty._id}
                >
                  {faculty.code} - {faculty.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText className="crud-helperText">
            This field is required
          </FormHelperText>
        </FormControl>

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Department Name</InputLabel>
          <Input
            className="crud-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <FormHelperText className="crud-helperText">
            This field is required
          </FormHelperText>
        </FormControl>

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">
            Head of Department
          </InputLabel>
          <Input
            className="crud-input"
            value={HOD}
            onChange={(event) => setHOD(event.target.value)}
          />
        </FormControl>
      </div>

      <Button
        variant="success"
        className="crud-submit crud-add-btn green"
        disabled={facultyChosen === "" || name === "" ? true : false}
        onClick={handleSubmit}
      >
        Add Faculty
      </Button>
    </div>
  );
}

export default AddFaculty;
