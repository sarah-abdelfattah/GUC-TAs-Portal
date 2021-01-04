import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import checkLogin from "../helpers/checkLogin";

//icons
import { AiFillHome } from "react-icons/ai";

//users
import HRMenuItems from "./sidebar/HRMenuItems";

function SideBar() {
  const [user, setUser] = useState("");
  const [showHome, setHome] = useState(false);

  const routeChange = (path) => {
    document.location.href = path;
  };

  useEffect(() => {
    async function fetchData() {
      const res = (await checkLogin()).type;
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

        {user === "HR" ? <HRMenuItems /> : <p />}
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
