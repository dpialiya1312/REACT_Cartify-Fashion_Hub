import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",      // 🔥 KEY FIx
        background: "#F6F1F3"
      }}
    >
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          overflowY: "auto",
          height: "100vh",       // 🔥 Prevent white gap
          boxSizing: "border-box"
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;