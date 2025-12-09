"use client";
import type React from "react";
import { useEffect, useRef } from "react";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest('.dropdown-toggle')
    ) {
      onClose();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [onClose]);


  if (!isOpen) return null;

  return (
  <div
    ref={dropdownRef}
    className={`
absolute z-40 mt-4 max-h-[396px] w-[100px] md:w-[220px] lg:w-[300px] 
overflow-y-auto rounded-3xl border border-gray-200 bg-white p-4 shadow-lg
dark:border-gray-800 dark:bg-gray-dark
left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0
      ${className}
    `}
  >
    {children}
  </div>
);

};
