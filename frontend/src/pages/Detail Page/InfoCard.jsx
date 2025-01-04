import React from "react";

const InfoCard = ({ icon, label, value }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 text-gray-500 mb-1">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <span className="text-sm font-medium">{value || "Not Specified"}</span>
  </div>
);

export default InfoCard;
