import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import checkLogin from "../helpers/checkLogin";
import { AiFillCaretDown } from "react-icons/ai";

//assets
import profileIcon from "../assets/profileIcon.svg";
import logout from "../assets/logout.svg";
import logo from "../assets/logo2.png";
import alert from "../assets/notification.svg";

import Notification from "./Notification";

function NavBar(props) {
  const [name, setName] = useState("");
  const [notification, setNot] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let res;
      if (!props.notify) res = (await checkLogin()).gucId;
      else res = (await checkLogin()).name;
      setName(res);
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("user");
    document.location.href = window.location.origin + "/login";
  };

  const handleNotifyClick = async () => {};

  return (
    <div>
      <Navbar className="navbar">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={profileIcon}
            className="profile-icon"
            onClick={() => (document.location.href = "/profile")}
          />{" "}
          <a className="navbar-name" href="/home">
            {name}
          </a>
        </Navbar.Brand>
        <img src={logo} alt="logo" className="nav-logo" />

        <img
          src={alert}
          alt="notification"
          className="notification"
          onClick={() => setNot(!notification)}
        />
        <img
          alt="logout icon"
          src={logout}
          className="logout-icon"
          onClick={handleLogout}
        />
      </Navbar>
      {notification ? (
        <div>
          <AiFillCaretDown className="arrow-icon" />
          <Notification />{" "}
        </div>
      ) : null}
    </div>
  );
}

export default NavBar;
