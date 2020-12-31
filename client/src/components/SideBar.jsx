import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import checkLogin from "../helpers/checkLogin";

//icons
import { FaUserAlt } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";

//users
import HRMenuItems from "./sidebar/HRMenuItems";

function SideBar() {
  const [user, setUser] = useState("");
  const [showHome, setHome] = useState(false);
  const [showProfile, setProfile] = useState(false);

  const routeChange = (path) => {
    document.location.href = path;
  };

  useEffect(() => {
    async function fetchData() {
      const res = await checkLogin();
      setUser(res);
    }
    fetchData();
  }, []);

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

        {user === "HR" ? <HRMenuItems /> : <p />}
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
