import React from "react";

const TeamCard = ({
  team,
  size = "w-32 h-32",
  className = "",
  imageClassName = "object-cover",
}) => {
  return (
    <div className={`flex flex-col items-center w-[220px] ${className}`}>
      <div className={`${size} overflow-hidden`}>
        <img
          src={team.logo}
          alt={team.name}
          className={`w-full h-full ${imageClassName}`}
          draggable={false}
          loading="lazy"
        />
      </div>

      <h3
        className="mt-4 text-xl font-black tracking-wide uppercase text-center truncate w-full px-1 nom-equipe"
        style={{ color: "#ffffff" }}
      >
        {team.name}
      </h3>

      {team.location && (
        <span
          className="mt-0.5 text-[11px] font-bold tracking-wider uppercase nom-equipe"
          style={{ color: "#34d399" }}
        >
          ({team.location})
        </span>
      )}
    </div>
  );
};

export default TeamCard;