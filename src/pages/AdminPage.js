import React from "react";
import "./adminpage.scss";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div id="container">
      <Outlet />
    </div>
  );
};

export default AdminPage;
