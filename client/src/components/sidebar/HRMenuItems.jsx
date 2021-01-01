import React, { useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";

//icons
import { MdLocationOn } from "react-icons/md";

function HRMenuItems() {
  const [showLocation, setLocation] = useState(false);
  const [showFaculty, setFaculty] = useState(false);

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
        icon={<MdLocationOn />}
        onMouseEnter={() => setFaculty(true)}
        onMouseLeave={() => setFaculty(false)}
        onClick={() => routeChange("faculty")}
      >
        {showFaculty ? "Faculty" : ""}
      </MenuItem>
    </Menu>
  );
}

export default HRMenuItems;
