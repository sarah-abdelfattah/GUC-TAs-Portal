import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { Nav, Link } from "react-bootstrap";

//assets
import profileIcon from "../assets/profileIcon.svg";
import logout from "../assets/logout.svg";

function NavBar() {
  //TODO: when login is finished .. get user data from token/session
  //TODO: when logout button

  return (
    <Navbar className="navbar">
      <Navbar.Brand href="#home">
        <img
          alt=""
          src={profileIcon}
          width="50"
          height="50"
          className="profile-icon"
        />{" "}
        <a className="navbar-name" href="/">
          Mohammed Abdelafattah
        </a>
      </Navbar.Brand>
      <img
        alt="logout icon"
        src={logout}
        width="40"
        height="30"
        className="logout-icon"
      />
    </Navbar>
  );
}

export default NavBar;
