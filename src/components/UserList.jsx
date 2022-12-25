import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserList.css";
import Cookies from "js-cookie";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState(false);

  useEffect(() => {
    const raw = Cookies.get("auth_state").toString();
    const length = raw.length;
    const id = raw.substring(1, length - 1);
    async function getUsers() {
      try {
        const user = await axios.get("http://localhost:5000/users/" + id);
        console.log(user);
        if (user.data.role === "Admin") {
          setPermissions(true);
        }
        const usersList = await axios.get("http://localhost:5000/users/");
        setUsers([]);
        usersList.data.map((user) => setUsers((arr) => [...arr, user]));
        console.log(users);
      } catch (e) {
        console.log("Something went wrong...", e.message);
      }
    }
    getUsers();
  }, []);

  function refresh() {
    const raw = Cookies.get("auth_state").toString();
    const length = raw.length;
    const id = raw.substring(1, length - 1);
    async function getUsers() {
      try {
        const user = await axios.get("http://localhost:5000/users/" + id);
        setPermissions(false);
        if (user.data.role === "Admin") {
          setPermissions(true);
        }
        const usersList = await axios.get("http://localhost:5000/users/");
        setUsers([]);
        usersList.data.map((user) => setUsers((arr) => [...arr, user]));
        console.log(users);
      } catch (e) {
        console.log("Something went wrong...", e.message);
      }
    }
    getUsers();
  }
  async function deleteUser(id) {
    await axios
      .delete("http://localhost:5000/users/delete/" + id)
      .then((res) => console.log(res.data));
    refresh();
  }
  const UserItem = ({ user }) => {
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td hidden={!permissions}>
          <Link to={"/hours/" + user._id}>view hours</Link> |{" "}
          <Link to={"/edit/" + user._id}>edit</Link> |{" "}
          <Link onClick={() => deleteUser(user._id)}>delete</Link>
        </td>
      </tr>
    );
  };
  return (
    <div className="wrapper">
      <div className="container mt-5 px-2">
        <h3>User List</h3>
        <div className="position-relative">
          <span className="position-absolute search">
            <i className="fa fa-search"></i>
          </span>
          <input className="form-control w-100" placeholder="Search by name" />
        </div>
        <div className="table-responsive">
          <table className="table table-responsive table-borderless">
            <thead className="thead-light">
              <tr className="bg-light">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th hidden={!permissions}>Options</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return <UserItem key={user.id} user={user} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
