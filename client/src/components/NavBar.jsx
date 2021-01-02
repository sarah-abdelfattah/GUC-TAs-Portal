import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import checkLogin from "../helpers/checkLogin";

//assets
import profileIcon from "../assets/profileIcon.svg";
import logout from "../assets/logout.svg";

function NavBar() {
  const [name, setName] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = (await checkLogin()).name;
      setName(res);
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("user");
    document.location.href = "/login";
  };

  return (
    <Navbar className="navbar">
      <Navbar.Brand href="#home">
        <img alt="" src={profileIcon} className="profile-icon" />{" "}
        <a className="navbar-name" href="/">
          {name}
        </a>
      </Navbar.Brand>
      <img
        alt="logout icon"
        src={logout}
        className="logout-icon"
        onClick={handleLogout}
      />
    </Navbar>
  );
}

export default NavBar;
