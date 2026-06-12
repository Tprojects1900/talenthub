import React, { useState, useRef, useEffect } from "react";
import {
  Trophy,
  Medal,
  Award,
  Star,
  ChevronDown,
} from "lucide-react";

const editionIcons = [
  Trophy, // Edition 4 (la plus récente)
  Trophy,
  Trophy,
  Trophy,
];

export const TopDropMenu = ({
  items = [],
  bgColor = "bg-orange-600/25",
  textColor = "text-orange-700",
  hoverColor = "hover:bg-orange-600/20",
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const ref = useRef();

  const SelectedIcon = editionIcons[selectedIndex] || Trophy;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block">
      {/* Bouton */}
      <div
        onClick={() => setOpen(!open)}
        className={`w-[160px] h-[30px] p-2 rounded-0 cursor-pointer flex items-center justify-between ${bgColor} ${textColor} backdrop-blur-md  hover:shadow-md transition-all`}
      >
        <div className="flex items-center gap-1 truncate">
          <SelectedIcon size={14} />
          <span className="text-xs font-medium truncate">
            {items[selectedIndex]}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[110%] left-1/2 -translate-x-1/2 w-[180px] bg-white rounded-0 shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
          {items.map((item, index) => {
            const Icon = editionIcons[index] || Star;

            return (
              <div
                key={index}
                onClick={() => handleSelect(index)}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${hoverColor} transition ${
                  selectedIndex === index
                    ? "font-semibold bg-gray-50"
                    : ""
                }`}
              >
                <Icon size={14} />
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};