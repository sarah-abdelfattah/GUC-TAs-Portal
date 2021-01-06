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

function DeleteCourse() {
  const [faculties, setFaculties] = useState({ faculties: [] });
  const [facultyChosen, setFacultyChosen] = useState("");
  const [departments, setDepartments] = useState({ departments: [] });
  const [depChosen, setDepChosen] = useState("");
  const [courses, setCourses] = useState({ departments: [] });
  const [courseChosen, setCourseChosen] = useState("");

  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const facResult = await axiosCall("get", "faculties/faculty/all");
      setFaculties(facResult.data.data);
    }
    fetchData();
  }, [facultyChosen]);

  const handleFacOnChange = async (target) => {
    setFacultyChosen(target.value);
    const facCode = faculties.find(({ _id }) => _id === target.value).code;

    const depResult = await axiosCall(
      "get",
      `departments/department/${facCode}/all`
    );
    setDepartments(depResult.data.data);
  };

  const handleDepOnChange = async (target) => {
    const facCode = faculties.find(({ _id }) => _id === facultyChosen).code;

    setDepChosen(target.value);
    const depName = departments.find(({ _id }) => _id === target.value).name;

    const courseResult = await axiosCall(
      "get",
      `courses/course/${facCode}/${depName}/all`
    );
    setCourses(courseResult.data.data);
  };

  const handleSubmit = async () => {
    try {
      let code;
      if (faculties)
        code = await faculties.find(({ _id }) => _id === facultyChosen).code;

      let depName;
      if (departments)
        depName = await departments.find(({ _id }) => _id === depChosen).name;

      let courseName;
      if (courses)
        courseName = await courses.find(({ _id }) => _id === courseChosen).name;

      const body = {
        facultyCode: code.toUpperCase(),
        departmentName: depName,
        courseName: courseName,
      };

      const res = await axiosCall("delete", "courses/course", body);

      if (res.data.data) {
        addToast("Course deleted successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setFacultyChosen("");
        setDepChosen("");
        setCourseChosen("");
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
              handleFacOnChange(event.target);
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
              handleDepOnChange(event.target);
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

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Course</InputLabel>
          <Select
            className="crud-select"
            value={courseChosen}
            onChange={(event) => setCourseChosen(event.target.value)}
          >
            {courses.length > 0 &&
              courses.map((course) => (
                <MenuItem
                  className="crud-menuItem"
                  value={course._id}
                  key={course._id}
                >
                  {course.name}
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
        disabled={
          facultyChosen === "" || depChosen === "" || courseChosen === ""
            ? true
            : false
        }
        onClick={handleSubmit}
      >
        Delete Course
      </Button>
    </div>
  );
}

export default DeleteCourse;
