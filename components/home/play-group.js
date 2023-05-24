import React from "react";
import Link from "next/link";

export const PlayGroup = () => {
  return (
    <div className="play-in-group-section">
      <h1>Playing in a group</h1>
      <Link href="/group">
        <div
          id="nav-megamillions-group-ticket"
          className="home-banner-new"
          style={{ cursor: "pointer" }}
        ></div>
      </Link>
    </div>
  );
};

export default PlayGroup;
