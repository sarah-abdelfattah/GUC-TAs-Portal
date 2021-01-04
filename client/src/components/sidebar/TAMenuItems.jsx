import React, { useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";

//icons
import { MdLocationOn, MdPersonAdd } from "react-icons/md";
import { FaUniversity, FaClipboardList, FaBook } from "react-icons/fa";

function TAMenuItems() {
  const [icons, setIcons] = useState({
    courseCoverage: false,
    staff: false,
  });

  const routeChange = (path) => {
    document.location.href = window.location.origin + `/${path}`;
  };

  const showTag = (name) => {
    setIcons({
      ...icons,
      [name]: true,
    });
  };

  return (
    <Menu iconShape="round" className="first-new">
      <MenuItem
        icon={<MdPersonAdd />}
        onMouseEnter={() => showTag("staff")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("viewStaff")}
      >
        {icons.staff ? "Staff " : ""}
      </MenuItem>

      <MenuItem
        icon={<FaBook />}
        onMouseEnter={() => showTag("course")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("viewCourseCoverage")}
      >
        {icons.courseCoverage ? "Course Coverage" : ""}
      </MenuItem>
    </Menu>
  );
}

export default TAMenuItems;
