import React from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";

//icons
import { FaUserAlt } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";

function SideBar() {
  return (
    <ProSidebar collapsed="false" className="custom-sidebar">
      <Menu iconShape="round">
        <MenuItem icon={<AiFillHome />}></MenuItem>
        <MenuItem icon={<FaUserAlt />}></MenuItem>
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
