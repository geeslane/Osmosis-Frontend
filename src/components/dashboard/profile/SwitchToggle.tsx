"use client";
import React from "react";

type Props = {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
};

const SwitchToggle = ({ label, description = "", enabled, onToggle }: Props) => (
  <div className="flex items-start justify-between">
    <div>
      <p className="font-normal text-sm text-black">{label}</p>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
    <button
      onClick={onToggle}
      className={`w-8 h-4 flex items-center rounded-full transition-colors duration-300 ${enabled ? "bg-green-500" : "bg-gray-300"}`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${enabled ? "translate-x-4" : ""}`}
      ></div>
    </button>
  </div>
);

export default SwitchToggle;
