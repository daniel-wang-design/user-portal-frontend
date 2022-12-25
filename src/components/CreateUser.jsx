import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./CreateUser.css";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import Cookies from "js-cookie";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showUser, setShowUser] = useState(false);
  const [failed, setFailed] = useState(false);
  const [role, setRole] = useState("Student");
  const [permissions, setPermissions] = useState(false);

  useEffect(() => {
    const raw = Cookies.get("auth_state").toString();
    const length = raw.length;
    const id = raw.substring(1, length - 1);
    async function getUser() {
      try {
        const user = await axios.get("http://localhost:5000/users/" + id);
        if (user.data.role === "Admin") {
          setPermissions(true);
        }
      } catch (e) {
        console.log("Something went wrong...");
      }
    }
    getUser();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setRole(document.getElementById("role-select").value);
    const user = {
      name: name,
      role: document.getElementById("role-select").value,
      email: email,
      password: password,
    };
    console.log(user);
    await axios
      .post("http://localhost:5000/users/add", user)
      .then((res) => {
        if (res.status === 200) {
          setShowUser(true);
          setFailed(false);
        }
      })
      .catch((err) => {
        if (err.response.status !== 200) {
          setShowUser(false);
          setFailed(true);
        }
      });
    try {
      const response = await axios.get(
        "http://localhost:5000/users/findByEmail/" + email
      );
      console.log(response.data._id);
      axios
        .post("http://localhost:5000/volunteer/add", {
          userID: response.data._id,
          volunteerRecord: [],
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } catch (e) {
      console.log(e.message);
    }
  };
  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowUser(false);
    setFailed(false);
  };
  if (!permissions) {
    return (
      <div>
        <h1 className="text-danger mt-4 container">
          You do not have permission to view this page.
        </h1>
      </div>
    );
  }
  return (
    <div className="container mt-4">
      <h3>Create New User</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            className="form-control border-[2px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="text"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            className="form-select"
            id="role-select"
            defaultValue="Student"
          >
            <option value="Student">Student</option>
            <option value="Tutor">Tutor</option>
            <option value="Executive">Executive</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <br />
        <div className="form-group" hidden={showUser}>
          <input
            type="submit"
            value="Create User"
            className="btn btn-primary"
          />
        </div>
      </form>
      <div hidden={!showUser}>
        <br />
        <h5>New user was created: </h5>
        <br />
        <p>
          <b>Name: </b>
          {name}
        </p>
        <p>
          <b>Email: </b>
          {email}
        </p>
        <p>
          <b>Password: </b>
          {password}
        </p>
        <p>
          <b>Role: </b>
          {role}
        </p>
        <div className="form-group">
          <input
            value="Create another user"
            onClick={reset}
            className="btn btn-primary"
          />
        </div>
      </div>
      <div hidden={!failed}>
        <br />
        <p className="text-danger">Something went wrong...</p>
      </div>
    </div>
  );
};

export default CreateUser;
