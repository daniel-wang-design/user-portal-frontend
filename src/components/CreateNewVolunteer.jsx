import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./CreateNewVolunteer.css";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const CreateUser = () => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [status, setStatus] = useState("none");

  const [badDescription, setBadDescription] = useState(false);
  const [badDate, setBadDate] = useState(false);
  const [badHours, setBadHours] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBadDate(false);
    setBadDescription(false);
    setBadHours(false);
    if (description.length === 0 || description.length > 100) {
      setBadDescription(true);
      return;
    }
    if (date.length !== 10) {
      setBadDate(true);
      return;
    }
    try {
      const year = Number(date.substring(0, 4));
      if (!(2023 <= year && year <= 2030)) {
        setBadDate(true);
        return;
      }
      const month = Number(date.substring(5, 7));
      if (!(1 <= month && month <= 12)) {
        setBadDate(true);
        return;
      }
      const day = Number(date.substring(8));
      if (!(1 <= day && day <= 31)) {
        setBadDate(true);
        return;
      }
    } catch (e) {
      badDate(true);
      return;
    }
    try {
      const num = Number(hours);
      if (!(0 < num && num <= 300)) {
        setBadHours(true);
        return;
      }
    } catch (e) {
      setBadHours(true);
      return;
    }
    const raw = Cookies.get("auth_state").toString();
    const length = raw.length;
    const userID = raw.substring(1, length - 1);
    const newItem = {
      description: description,
      date: date,
      hours: hours,
      userID: userID,
    };
    axios
      .post("http://localhost:5000/volunteer/addItem", newItem)
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
  const reset = () => {
    setDescription("");
    setDate("");
    setHours("");
    setStatus("none");
  };

  return (
    <div className="container mt-4">
      <h3>Create New Volunteer Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />{" "}
          <p hidden={!badDescription} className="text-danger">
            Description must be between 1 and 20 words
          </p>
        </div>
        <div className="form-group">
          <label>Date (YYYY/MM/DD)</label>
          <input
            type="text"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <p hidden={!badDate} className="text-danger">
            Invalid date
          </p>
        </div>
        <div className="form-group">
          <label>Hours</label>
          <input
            type="text"
            className="form-control"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />{" "}
          <p hidden={!badHours} className="text-danger">
            Number of hours must be between 0 and 300
          </p>
        </div>
        <br />
        <div className="form-group" hidden={status === "none" ? false : true}>
          <input
            type="submit"
            value="Create new Volunteer Record"
            className="btn btn-primary"
          />
        </div>
        <div>
          <div hidden={status === "good" ? false : true}>
            <hr />
            <h3>Created Record succesfully!</h3>
            <div className="form-group">
              <input
                value="Create another entry"
                onClick={reset}
                className="btn btn-primary"
              />
            </div>
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
  );
};

export default CreateUser;
