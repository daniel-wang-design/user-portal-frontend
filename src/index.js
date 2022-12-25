import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-auth-kit";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider
    authType={"cookie"}
    authName={"auth"}
    cookieDomain={window.location.hostname}
  >
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </AuthProvider>
);
