import React from "react";

const TeamScorersCard = ({
  team,
  size = "w-24 h-24",
  className = "",
  imageClassName = "object-cover",
}) => {
  return (
    <div className={`flex flex-col items-center w-[220px] ${className}`}>
      {/* Logo */}
      <div className={`${size} overflow-hidden`}>
        <img
          src={team.logo}
          alt={team.name}
          className={`w-full h-full ${imageClassName}`}
          draggable={false}
          loading="lazy"
        />
      </div>

      {/* Nom */}
      <h3
        className="mt-3 text-lg font-black tracking-wide italic uppercase text-center truncate w-full px-1 nom-equipe"
        style={{ color: "#ffffff" }}
      >
        {team.name}
      </h3>

      {/* Buteurs */}
      <div className="mt-2 min-h-[36px] w-full flex flex-col items-center justify-start gap-0.5">
        {(team.scorers ?? []).map((scorer, index) => (
          <p
            key={index}
            className="text-[10px] font-medium leading-none text-center truncate w-full nom-equipe"
            style={{ color: "#a1a1aa" }}
          >
            {scorer?.name}
            {scorer?.dorsa ? ` (${scorer.dorsa})` : ""}
            {" "}
            <span
              className="font-bold"
              style={{ color: "#fb923c" }}
            >
              {scorer?.minute}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default TeamScorersCard;