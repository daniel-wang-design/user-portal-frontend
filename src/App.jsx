import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateUser from "./components/CreateUser";
import UserList from "./components/UserList";
import UpdateUser from "./components/UpdateUser";
import Login from "./components/Login";
import Home from "./components/Home";
import Hours from "./components/Hours";
import UpdateVolunteerHour from "./components/UpdateVolunteerHour";
import CreateNewVolunteer from "./components/CreateNewVolunteer";
import AdminHours from "./components/AdminHours";
import { RequireAuth } from "react-auth-kit";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth loginPath="/login">
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/hours"
          element={
            <RequireAuth loginPath="/login">
              <Hours />
            </RequireAuth>
          }
        />
        <Route
          path="/hours/:id"
          element={
            <RequireAuth loginPath="/login">
              <AdminHours />
            </RequireAuth>
          }
        />
        <Route
          path="/list"
          element={
            <RequireAuth loginPath="/login">
              <UserList />
            </RequireAuth>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <RequireAuth loginPath="/login">
              <UpdateUser />
            </RequireAuth>
          }
        />
        <Route
          path="/create"
          element={
            <RequireAuth loginPath="/login">
              <CreateUser />
            </RequireAuth>
          }
        />
        <Route
          path="/newVolunteer"
          element={
            <RequireAuth loginPath="/login">
              <CreateNewVolunteer />
            </RequireAuth>
          }
        />
        <Route
          path="/updateVolunteer/:id"
          element={
            <RequireAuth loginPath="/login">
              <UpdateVolunteerHour />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
