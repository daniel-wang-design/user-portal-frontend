import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="wrapper">
      <div className="container mt-4">
        <h3>Welcome to FOCUS Youth's User Portal</h3>
        <p>
          This is the portal used to track your volunteer hours. Additionally,
          you can see a list of all active FOCUS Youth Members to verify a
          member's identity.
        </p>
        <p>
          If you have any technical issues, please contact admin@focusyouth.ca.
        </p>
      </div>
    </div>
  );
};

export default Home;
