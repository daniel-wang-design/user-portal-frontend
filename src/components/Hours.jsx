import "./Hours.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

const Hours = () => {
  const [hours, setHours] = useState([]);
  const [permissions, setPermissions] = useState(false);

  useEffect(() => {
    const raw = Cookies.get("auth_state").toString();
    const length = raw.length;
    const id = raw.substring(1, length - 1);
    async function getHours() {
      try {
        const hoursList = await axios.get(
          "http://localhost:5000/volunteer/get/" + id
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
      } catch (e) {
        console.log("Something went wrong...", e.message);
      }
    }
    getHours();
    console.log(hours);
  }, []);

  function refresh() {
    const raw = Cookies.get("auth_state").toString();
    const length = raw.length;
    const id = raw.substring(1, length - 1);
    async function getHours() {
      try {
        const user = await axios.get("http://localhost:5000/users/" + id);
        if (user.data.role === "Admin") {
          setPermissions(true);
        }
        const hoursList = await axios.get(
          "http://localhost:5000/volunteer/get/" + id
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
        await setHours(temp);
      } catch (e) {
        console.log("Something went wrong...", e.message);
      }
    }
    getHours();
    console.log(hours);
  }
  async function deleteItem(id) {
    const raw = Cookies.get("auth_state").toString();
    const length = raw.length;
    const userID = raw.substring(1, length - 1);
    const item = {
      userID: userID,
      _id: id,
    };
    await axios
      .post("http://localhost:5000/volunteer/delete", item)
      .then((res) => console.log(res.data));
    refresh();
  }
  const ListItem = ({ item }) => {
    return (
      <tr>
        <td>{item.description}</td>
        <td>{item.date.substring(0, 10)}</td>
        <td>{item.hours}</td>
        <td>{item.approvedBy === "x" ? "N/A" : item.approvedBy}</td>
        <td hidden={item.approvedBy === "x" ? false : true}>
          <Link to={"/updateVolunteer/" + item._id}>edit</Link> |{" "}
          <Link onClick={() => deleteItem(item._id)}>delete</Link>
        </td>
        <td hidden={item.approvedBy === "x" ? true : false}>
          Cannot edit approved hours
        </td>
      </tr>
    );
  };
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
        <h3>My Volunteer Hours</h3>
        <Link to="/newVolunteer">
          <button type="button" className="btn btn-primary">
            Add New Volunteer Record
          </button>
        </Link>

        <div className="table-responsive mt-4">
          <table className="table table-responsive table-borderless">
            <thead className="thead-light">
              <tr className="bg-light">
                <th>Description</th>
                <th>Date (YYYY/MM/DD) </th>
                <th>Hours</th>
                <th>Approved by</th>
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

export default Hours;
