import React from "react";
import Topbar from "../components/Topbar";

export function UserDashboard() {
  return (
    <>
      <Topbar />
      <div style={{ padding: "50px", textAlign: "center", minHeight: "80vh" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1976d2" }}>User Dashboard</h1>
        <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
          Welcome back! Here you can view your bookings, manage your profile, and search for vehicles.
        </p>
      </div>
    </>
  );
}

export default UserDashboard;
