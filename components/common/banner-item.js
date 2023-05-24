import React from "react";

const BannerItem = (props) => {
  const { type, background, position } = props;
  const cls = "slogan_" + type;
  return (
    <div className="item">
      <div
        className="lotto_banner"
        style={{
          height: "410px",
          width: "100%",
          background: background,
          backgroundSize: "cover",
          backgroundPosition: position,
        }}
      ></div>
    </div>
  );
};

export default BannerItem;
