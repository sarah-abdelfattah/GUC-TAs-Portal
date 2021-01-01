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

function UpdateFaculty() {
  const [faculties, setFaculties] = useState({ faculties: [] });
  const [facultyChosen, setFacultyChosen] = useState("");
  const [departments, setDepartments] = useState({ departments: [] });
  const [depChosen, setDepChosen] = useState("");
  const [staff, setStaff] = useState({ staff: [] });
  const [HODChosen, setHODChosen] = useState("");
  const [newFacultyChosen, setNewFacultyChosen] = useState("");

  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const facResult = await axiosCall("get", "faculties/faculty/all");
      const staffResult = await axiosCall(
        "get",
        "staffMembers/AC/Course Instructor/all"
      );
      setFaculties(facResult.data.data);
      setNewFacultyChosen(facResult.data.data);
      setStaff(staffResult.data.data);
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
      let dep;
      if (depChosen)
        dep = await departments.find(({ _id }) => _id === depChosen).name;

      let code;
      if (faculties)
        code = await faculties.find(({ _id }) => _id === facultyChosen).code;

      let HOD;
      if (HODChosen)
        HOD = await staff.find(({ _id }) => _id === HODChosen).gucId;

      let newFac;
      if (newFacultyChosen)
        newFac = await faculties.find(({ _id }) => _id === newFacultyChosen)
          .code;

      const body = {
        facultyCode: code.toUpperCase(),
        depName: dep,
        HOD: HODChosen ? HOD : undefined,
        newFacultyCode: newFacultyChosen ? newFac : undefined,
      };

      const res = await axiosCall("put", "departments/department", body);

      if (res.data.data) {
        addToast("Department created successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setFacultyChosen("");
        setDepChosen("");
        setHODChosen("");
        setNewFacultyChosen("");
      }
      console.log(
        "🚀 ~ file: UpdateDepartment.jsx ~ line 92 ~ handleSubmit ~ es.data.error",
        res.data.error
      );

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

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">
            Head of Department
          </InputLabel>
          <Select
            className="crud-select"
            value={HODChosen}
            onChange={(event) => {
              setHODChosen(event.target.value);
            }}
          >
            {staff.length > 0 &&
              staff.map((member) => (
                <MenuItem
                  className="crud-menuItem"
                  value={member._id}
                  key={member._id}
                >
                  {member.gucId} {member.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">
            Change Department's Faculty
          </InputLabel>
          <Select
            className="crud-select"
            value={newFacultyChosen}
            onChange={(event) => {
              setNewFacultyChosen(event.target.value);
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
        </FormControl>
      </div>

      <Button
        variant="primary"
        className="crud-submit crud-update-btn blue"
        disabled={facultyChosen === "" ? true : false}
        onClick={handleSubmit}
      >
        Update Department
      </Button>
    </div>
  );
}

export default UpdateFaculty;
