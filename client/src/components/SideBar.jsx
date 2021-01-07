import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import checkLogin from "../helpers/checkLogin";
import axiosCall from "../helpers/axiosCall";

//icons
import { AiFillHome } from "react-icons/ai";
import { RiFolderWarningFill } from "react-icons/ri";

//users
import HRMenuItems from "./sidebar/HRMenuItems";
import HODMenuItems from "./sidebar/HODMenuItems";
import CIMenuItems from "./sidebar/CIMenuItems";
import TAMenuItems from "./sidebar/TAMenuItems";

function SideBar() {
  const [user, setUser] = useState("");
  const [showHome, setHome] = useState(false);
  const [showRequest, setRequest] = useState(false);

  const routeChange = (path) => {
    document.location.href = window.location.origin + `/${path}`;
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

        {user === "HOD" ? <HODMenuItems /> : <p />}
        {user === "Course Instructor" ? <CIMenuItems /> : <p />}
        {user === "Teaching Assistant" ? <TAMenuItems /> : <p />}
        {user === "HR" ? (
          <HRMenuItems />
        ) : (
          <MenuItem
            icon={<RiFolderWarningFill />}
            onMouseEnter={() => setRequest(true)}
            onMouseLeave={() => setRequest(false)}
            onClick={() => routeChange("request")}
          >
            {showRequest ? "Requests" : ""}
          </MenuItem>
        )}
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
