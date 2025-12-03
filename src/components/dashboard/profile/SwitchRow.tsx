"use client";

import { ChevronRight } from "lucide-react";

const SwitchRow = ({
  label,
  description,
  active,
  onClick,
  danger = false,
}: {
  label: string;
  description: string;
  active?: boolean;
  onClick: () => void;
  danger?: boolean;
}) => {
  const isDelete = danger;

  const labelColor = isDelete
    ? active
      ? "text-red-500"
      : "text-red-400"
    : active
    ? "text-black font-semibold"
    : "text-gray-700";

  const iconColor = isDelete
    ? active
      ? "text-red-500"
      : "text-red-400"
    : active
    ? "text-black"
    : "text-gray-400 group-hover:text-black";

  const descriptionColor = isDelete
    ? active
      ? "text-red-500"
      : "text-red-400"
    : active
    ? "text-gray-700"
    : "text-gray-500";

  return (
    <div onClick={onClick} className="cursor-pointer group py-2 space-y-1">
      <div className="flex items-center gap-1">
        <p className={`text-sm font-open-sans ${labelColor}`}>{label}</p>
        <ChevronRight className={`transition duration-200 ${iconColor}`} size={16} />
      </div>
      <p className={`text-sm font-open-sans ${descriptionColor}`}>{description}</p>
    </div>
  );
};

export default SwitchRow;
