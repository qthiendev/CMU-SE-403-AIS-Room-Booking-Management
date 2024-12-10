import React from "react";
import "./Admin.css";

const Admin = () => {
  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-sections">
        {/* Section for User Management */}
        <div className="admin-card">
          <h2>User Management</h2>
          <p>Manage user accounts, roles, and permissions.</p>
          <button className="admin-btn">Go to User Management</button>
        </div>

        {/* Section for Hotel Management */}
        <div className="admin-card">
          <h2>Hotel Management</h2>
          <p>Oversee hotel listings and verify information.</p>
          <button className="admin-btn">Go to Hotel Management</button>
        </div>

        {/* Section for Reports */}
        <div className="admin-card">
          <h2>System Reports</h2>
          <p>View detailed analytics and system activity reports.</p>
          <button className="admin-btn">View Reports</button>
        </div>

        {/* Section for System Settings */}
        <div className="admin-card">
          <h2>System Settings</h2>
          <p>Update system configurations and settings.</p>
          <button className="admin-btn">Configure Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
