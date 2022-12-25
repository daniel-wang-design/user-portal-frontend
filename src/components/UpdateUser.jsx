import React, { Component, useEffect, useState, useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./UpdateUser.css";

const UpdateUser = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState(useParams);
  const [status, setStatus] = useState("none");

  useEffect(() => {
    axios.get("http://localhost:5000/users/" + id.id).then((res) => {
      setName(res.data.name);
      setRole(res.data.role);
      setEmail(res.data.email);
      setPassword(res.data.password);
    });
    console.log(role);
  }, [id.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setRole(document.getElementById("role-select").value);
    const user = {
      name: name,
      role: document.getElementById("role-select").value,
      email: email,
      password: password,
    };
    console.log(user);

    axios
      .post("http://localhost:5000/users/update/" + id.id, user)
      .then((res) => {
        if (res.status === 200) {
          setStatus("good");
        }
      })
      .catch((err) => {
        if (err.response.status !== 200) {
          setStatus("bad");
        }
      });
  };
  return (
    <div className="wrapper">
      <div className="container mt-4">
        <h3>User details</h3>
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
        <hr />
        <h3>Update User</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>{" "}
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>{" "}
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
            <select className="form-select" id="role-select">
              <option
                value="Student"
                selected={role === "Student" ? true : false}
              >
                Student
              </option>
              <option value="Tutor" selected={role === "Tutor" ? true : false}>
                Tutor
              </option>
              <option value="Admin" selected={role === "Admin" ? true : false}>
                Admin
              </option>
            </select>
          </div>
          <br />
          <div className="form-group">
            <input
              type="submit"
              value="Update User"
              className="btn btn-primary"
            />
          </div>
          <div>
            <div hidden={status === "good" ? false : true}>
              <hr />
              <h3>User updated succesfully:</h3>
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
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
            <p hidden={status === "bad" ? false : true} className="text-danger">
              Something went wrong...
              <br />
              <br />
              <br />
              <br />
              <br />
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
