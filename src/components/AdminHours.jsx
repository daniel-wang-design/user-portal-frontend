import "./AdminHours.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const AdminHours = () => {
  const [hours, setHours] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState(useParams);
  const [permissions, setPermissions] = useState(false);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const userID = id.id;
    console.log(userID);
    const raw = Cookies.get("auth_state").toString();
    const length = raw.length;
    const viewerID = raw.substring(1, length - 1);
    async function getHours() {
      try {
        const verify = await axios.get(
          "http://localhost:5000/users/" + viewerID
        );
        if (verify.data.role === "Admin") {
          setPermissions(true);
        }
        const getName = await axios.get(
          "http://localhost:5000/users/" + userID
        );
        setName(getName.data.name);
        setEmail(getName.data.email);
        setRole(getName.data.role);
        const hoursList = await axios.get(
          "http://localhost:5000/volunteer/get/" + userID
        );
        setHours([]);
        const temp = [];
        hoursList.data.volunteerRecord.map((item) => {
          temp.push(item);
        });
        console.log(temp);
        temp.sort((a, b) => {
          const d1 = new Date(a.date);
          const d2 = new Date(b.date);
          return d1 < d2;
        });
        setHours(temp);
        setTotalHours(total(temp));
      } catch (e) {
        console.log("Something went wrong...", e.message);
      }
    }
    getHours();
    console.log(hours);
  }, []);

  function total(list) {
    var temp = 0;
    for (var i = 0; i < list.length; i++) {
      temp += list[i].hours;
    }
    return temp;
  }
  function refresh() {
    const userID = id.id;
    console.log(userID);
    const raw = Cookies.get("auth_state").toString();
    const length = raw.length;
    const viewerID = raw.substring(1, length - 1);
    async function getHours() {
      try {
        const verify = await axios.get(
          "http://localhost:5000/users/" + viewerID
        );
        if (verify.data.role === "Admin") {
          setPermissions(true);
        }
        const getName = await axios.get(
          "http://localhost:5000/users/" + userID
        );
        setName(getName.data.name);
        setEmail(getName.data.email);
        setRole(getName.data.role);
        const hoursList = await axios.get(
          "http://localhost:5000/volunteer/get/" + userID
        );
        setHours([]);
        const temp = [];
        hoursList.data.volunteerRecord.map((item) => {
          temp.push(item);
        });
        temp.sort((a, b) => {
          const d1 = new Date(a.date);
          const d2 = new Date(b.date);
          return d1 < d2;
        });
        console.log(temp);
        setHours(temp);
        setTotalHours(total(temp));
      } catch (e) {
        console.log("Something went wrong...", e.message);
      }
    }
    getHours();
    console.log(hours);
  }
  async function approve(item) {
    try {
      const raw = Cookies.get("auth_state").toString();
      const length = raw.length;
      const userID = raw.substring(1, length - 1);
      const getAdmin = await axios.get("http://localhost:5000/users/" + userID);
      const newItem = {
        description: item.description,
        date: item.date,
        hours: item.hours,
        updatedID: item._id,
        userID: id.id,
        approvedBy: getAdmin.data.name,
      };
      axios
        .post("http://localhost:5000/volunteer/edit", newItem)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
    refresh();
  }
  async function unapprove(item) {
    try {
      const raw = Cookies.get("auth_state").toString();
      const length = raw.length;
      const userID = raw.substring(1, length - 1);
      const getAdmin = await axios.get("http://localhost:5000/users/" + userID);
      const newItem = {
        description: item.description,
        date: item.date,
        hours: item.hours,
        updatedID: item._id,
        userID: id.id,
        approvedBy: "x",
      };
      axios
        .post("http://localhost:5000/volunteer/edit", newItem)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
    refresh();
  }
  const ListItem = ({ item }) => {
    return (
      <tr>
        <td>{item.description}</td>
        <td>{item.date.substring(0, 10)}</td>
        <td>{item.hours}</td>
        <td>{item.approvedBy === "x" ? "N/A" : item.approvedBy}</td>
        <td>
          <Link
            onClick={() => approve(item)}
            hidden={item.approvedBy === "x" ? false : true}
          >
            approve
          </Link>
          <Link
            onClick={() => unapprove(item)}
            hidden={item.approvedBy === "x" ? true : false}
          >
            unapprove
          </Link>
        </td>
      </tr>
    );
  };
  if (!permissions) {
    return (
      <div className="text-danger container mt-4">
        <h1>You do not have permission to view this page.</h1>
      </div>
    );
  }
  if (hours.length === 0) {
    return (
      <div className="container">
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <div className="wrapper">
      <div className="container mt-5 px-2">
        <h3>{"Volunteer Hours for: " + name} </h3>
        <h5>{"Email: " + email}</h5>
        <h5>{"Role: " + role}</h5>
        <h5>{"Total hours: " + totalHours}</h5>
        <div className="table-responsive mt-4">
          <table className="table table-responsive table-borderless">
            <thead className="thead-light">
              <tr className="bg-light">
                <th>Description</th>
                <th>Date (YYYY/MM/DD)</th>
                <th>Hours</th>
                <th>Approved By</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {hours.map((item) => {
                return <ListItem item={item} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHours;
