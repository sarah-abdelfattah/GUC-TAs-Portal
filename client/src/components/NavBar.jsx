import React from "react";
import Navbar from "react-bootstrap/Navbar";

//assets
import profileIcon from "../assets/profileIcon.svg";
import logout from "../assets/logout.svg";

function NavBar() {
  //TODO: when login is finished .. get user data from token/session
  //TODO: when logout button

  return (
    <Navbar className="navbar">
      <Navbar.Brand href="#home">
        <img alt="" src={profileIcon} className="profile-icon" />{" "}
        <a className="navbar-name" href="/">
          Mohammed Abdelafattah
        </a>
      </Navbar.Brand>
      <img alt="logout icon" src={logout} className="logout-icon" />
    </Navbar>
  );
}

export default NavBar;
