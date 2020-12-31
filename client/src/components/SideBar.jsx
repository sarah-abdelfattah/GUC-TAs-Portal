import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";

//icons
import { FaUserAlt } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";

//users
import HRMenuItems from "./sidebar/HRMenuItems";

function SideBar() {
  const [showHome, setHome] = useState(false);
  const [showProfile, setProfile] = useState(false);

  const routeChange = (path) => {
    document.location.href = path;
  };

  return (
    <ProSidebar collapsed="false" className="custom-sidebar">
      <Menu iconShape="round">
        <MenuItem
          icon={<AiFillHome />}
          onMouseEnter={() => setHome(true)}
          onMouseLeave={() => setHome(false)}
          onClick={() => routeChange("home")}
        >
          {showHome ? "Home" : ""}
        </MenuItem>

        <MenuItem
          icon={<FaUserAlt />}
          onMouseEnter={() => setProfile(true)}
          onMouseLeave={() => setProfile(false)}
          onClick={() => routeChange("profile")}
        >
          {showProfile ? "Profile" : ""}
        </MenuItem>

        <HRMenuItems />
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
