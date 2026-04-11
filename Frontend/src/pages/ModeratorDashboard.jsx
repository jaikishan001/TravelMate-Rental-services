import React from "react";
import Topbar from "../components/Topbar";

export function ModeratorDashboard() {
  return (
    <>
      <Topbar />
      <div style={{ padding: "50px", textAlign: "center", minHeight: "80vh" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#f57c00" }}>Moderator Dashboard</h1>
        <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
          Welcome, Moderator! Here you can review vehicles, approve listings, and handle content moderation.
        </p>
      </div>
    </>
  );
}

export default ModeratorDashboard;
