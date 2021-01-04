import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import checkLogin from "../helpers/checkLogin";
import axiosCall from "../helpers/axiosCall";

//icons
import { AiFillHome } from "react-icons/ai";

//users
import HRMenuItems from "./sidebar/HRMenuItems";
import HODMenuItems from "./sidebar/HODMenuItems";
import CIMenuItems from "./sidebar/CIMenuItems";
import TAMenuItems from "./sidebar/TAMenuItems";

function SideBar() {
  const [user, setUser] = useState("");
  const [showHome, setHome] = useState(false);

  const routeChange = (path) => {
    document.location.href = path;
  };

  useEffect(() => {
    async function fetchData() {
      const res = await checkLogin();
      setUser(res.type);

      const depResult = await axiosCall(
        "get",
        "departments/department/all/all"
      );

      if (depResult.data.data) {
        let HOD = await depResult.data.data.find(({ HOD }) => HOD === res.id);

        if (HOD) setUser("HOD");
      }
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
        {user === "HOD" ? <HODMenuItems /> : <p />}
        {user === "Course Instructor" ? <CIMenuItems /> : <p />}
        {user === "Teaching Assistant" ? <TAMenuItems /> : <p />}
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
