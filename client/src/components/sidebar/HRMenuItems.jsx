import React, { useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";

//icons
import { MdLocationOn } from "react-icons/md";
import { FaUniversity, FaClipboardList, FaBook } from "react-icons/fa";

function HRMenuItems() {
  const [showLocation, setLocation] = useState(false);
  const [showFaculty, setFaculty] = useState(false);
  const [showDepartment, setDepartment] = useState(false);
  const [showCourse, setCourse] = useState(false);

  const routeChange = (path) => {
    document.location.href = path;
  };

  return (
    <Menu iconShape="round" className="first-new">
      <MenuItem
        icon={<MdLocationOn />}
        onMouseEnter={() => setLocation(true)}
        onMouseLeave={() => setLocation(false)}
        onClick={() => routeChange("location")}
      >
        {showLocation ? "Location" : ""}
      </MenuItem>

      <MenuItem
        icon={<FaUniversity />}
        onMouseEnter={() => setFaculty(true)}
        onMouseLeave={() => setFaculty(false)}
        onClick={() => routeChange("faculty")}
      >
        {showFaculty ? "Faculty" : ""}
      </MenuItem>

      <MenuItem
        icon={<FaClipboardList />}
        onMouseEnter={() => setDepartment(true)}
        onMouseLeave={() => setDepartment(false)}
        onClick={() => routeChange("department")}
      >
        {showDepartment ? "Department" : ""}
      </MenuItem>

      <MenuItem
        icon={<FaBook />}
        onMouseEnter={() => setCourse(true)}
        onMouseLeave={() => setCourse(false)}
        onClick={() => routeChange("course")}
      >
        {showCourse ? "Course" : ""}
      </MenuItem>
    </Menu>
  );
}

export default HRMenuItems;
