import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";

//icons
import { FaUserAlt } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";

function SideBar() {
  const [showHome, setHome] = useState(false);
  const [showProfile, setProfile] = useState(false);

  return (
    <ProSidebar collapsed="false" className="custom-sidebar">
      <Menu iconShape="round">
        <MenuItem
          icon={<AiFillHome />}
          onMouseEnter={() => setHome(true)}
          onMouseLeave={() => setHome(false)}
        >
          {showHome ? "Home" : ""}
        </MenuItem>

        <MenuItem
          icon={<FaUserAlt />}
          onMouseEnter={() => setProfile(true)}
          onMouseLeave={() => setProfile(false)}
        >
          {showProfile ? "Profile" : ""}
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
