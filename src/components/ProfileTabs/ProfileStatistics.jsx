import React from "react";
import { FaRegCalendarCheck, FaRegClipboard } from "react-icons/fa";

export default function ProfileStatistics({ totalParticipated, totalHosted }) {
  return (
    <div className="profile-statistics" style={{ display: "flex", gap: "10px" }}>
      <div className="stat-card">
        <FaRegCalendarCheck className="stat-icon" />
        <p>Total event participations</p>
        <p className="stat-value">{totalParticipated}</p>
      </div>
      <div className="stat-card">
        <FaRegClipboard className="stat-icon" />
        <p>Successfully hosted events</p>
        <p className="stat-value">{totalHosted}</p>
      </div>
    </div>
  );
}
