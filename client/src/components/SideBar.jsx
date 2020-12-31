import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Router, Route, Link } from "react-router-dom";

//icons
import { FaUserAlt } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";

function SideBar() {
  const [showHome, setHome] = useState(false);
  const [showProfile, setProfile] = useState(false);
  const [showLocation, setLocation] = useState(false);

  return (
    <Router>
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

          <Link to="/location">
            <MenuItem
              icon={<MdLocationOn />}
              onMouseEnter={() => setLocation(true)}
              onMouseLeave={() => setLocation(false)}
              // onClick={() => {
              //   history.push("/location");
              // }}
            >
              {showLocation ? "Location" : ""}
            </MenuItem>
          </Link>
        </Menu>
      </ProSidebar>
    </Router>
  );
}

export default SideBar;
