import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../logo.png";
import { useSignOut, useIsAuthenticated } from "react-auth-kit";
import Cookies from "js-cookie";
import axios from "axios";

const Navbar = () => {
  const logOut = useSignOut();
  const [name, setName] = useState("");

  const signOut = () => {
    setName("");
    logOut();
    console.log("signed out");
  };

  useEffect(() => {
    async function getUsers() {
      try {
        const raw = Cookies.get("auth_state").toString();
        const length = raw.length;
        const id = raw.substring(1, length - 1);
        const user = await axios.get("http://localhost:5000/users/" + id);
        setName(user.data.name);
      } catch (e) {
        console.log("Something went wrong...", e.message);
      }
    }
    getUsers();
  }, []);
  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container">
        <img className="navbar-brand" src={logo} alt="..." height="36" />
        <Link to="/" className="navbar-brand">
          FOCUS Youth User Portal
        </Link>
        <div className="navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link text-white">
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/list" className="nav-link text-white">
                User List
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/create" className="nav-link text-white">
                Create new User
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/hours" className="nav-link text-white">
                My Hours
              </Link>
            </li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <Link className="nav-link text-white">{name + " | "}</Link>
        </div>
        <div className="d-flex align-items-center">
          <Link to="/" className="nav-link text-white" onClick={signOut}>
            Log Out
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
