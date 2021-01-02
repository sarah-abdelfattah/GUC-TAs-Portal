import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axiosCall from "../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";

import {
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";

function DeleteFaculty() {
  const [faculties, setFaculties] = useState({ faculties: [] });
  const [facultyChosen, setFacultyChosen] = useState("");
  const [departments, setDepartments] = useState({ departments: [] });
  const [depChosen, setDepChosen] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const facResult = await axiosCall("get", "faculties/faculty/all");
      setFaculties(facResult.data.data);
    }
    fetchData();
  }, [facultyChosen]);

  const handleOnChange = async (target) => {
    setFacultyChosen(target.value);
    const facCode = faculties.find(({ _id }) => _id === target.value).code;

    const depResult = await axiosCall("get", `departments/${facCode}/all`);
    setDepartments(depResult.data.data);
  };

  const handleSubmit = async () => {
    try {
      let code;
      if (faculties)
        code = await faculties.find(({ _id }) => _id === facultyChosen).code;

      let dep;
      if (departments)
        dep = await departments.find(({ _id }) => _id === depChosen).name;

      const body = {
        facultyCode: code.toUpperCase(),
        depName: dep,
      };

      const res = await axiosCall("delete", "departments/department", body);

      if (res.data.data) {
        addToast(res.data.data, {
          appearance: "success",
          autoDismiss: true,
        });

        setFacultyChosen("");
        setDepartments("");
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
              handleOnChange(event.target);
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
          <InputLabel className="crud-inputLabel">Department</InputLabel>
          <Select
            className="crud-select"
            value={depChosen}
            onChange={(event) => {
              setDepChosen(event.target.value);
            }}
          >
            {departments.length > 0 &&
              departments.map((department) => (
                <MenuItem
                  className="crud-menuItem"
                  value={department._id}
                  key={department._id}
                >
                  {department.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText className="crud-helperText">
            This field is required
          </FormHelperText>
        </FormControl>
      </div>

      <Button
        variant="danger"
        className="crud-submit crud-delete-btn red"
        disabled={facultyChosen === "" || depChosen === "" ? true : false}
        onClick={handleSubmit}
      >
        Delete Department
      </Button>
    </div>
  );
}

export default DeleteFaculty;
