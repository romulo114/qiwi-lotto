import React, { useEffect } from "react";

export const OwlCarousel = (props) => {
  const { id, responsive, items, count } = props;
  const Component = props.component;

  useEffect(() => {
    jQuery(`#${id}`).owlCarousel({
      loop: true,
      nav: true,
      navText: ["<div class='owl-prev'></div>", "<div class='owl-next'></div>"],
      items: count,
      responsiveClass: true,
      responsive,
    });
  }, [id, responsive]);
  return (
    <div
      id={id}
      className="owl-carousel owl-theme"
      style={{ opacity: "1", display: "block" }}
    >
      {items && items.map((item) => <Component {...item} key={item.id} />)}
    </div>
  );
};
