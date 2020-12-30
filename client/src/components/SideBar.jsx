import React from "react";
import { ProSidebar, SidebarContent, Menu, MenuItem } from "react-pro-sidebar";

//assets
import { FaUserAlt } from "react-icons/fa";

function SideBar() {
  return (
    <ProSidebar collapsed="false">
      <Menu iconShape="square">
        <br></br>
        <br></br>
        <br></br>

        <MenuItem icon={<FaUserAlt />}>Dashboard</MenuItem>
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
