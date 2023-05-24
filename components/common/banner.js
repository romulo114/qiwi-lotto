import { useEffect } from "react";
import BannerItem from "./banner-item";
import { formatNumber } from "../../helpers/number";
import Link from "next/link";

const Banner = ({ banners, lottery }) => {
  useEffect(() => {
    jQuery("#owl-home-banner").owlCarousel({
      autoplay: true,
      loop: true,
      navigation: false, // Show next and prev buttons
      dots: false,
      slideSpeed: 1000,
      paginationSpeed: 400,
      singleItem: true,
      pagination: false,
      items: 1,
    });
  }, []);
  return (
    <section id="banner">
      <div id="owl-home-banner" className="owl-carousel owl-theme">
        {banners &&
          banners.map((item, idx) => <BannerItem {...item} key={idx} />)}
      </div>

      <div className="phoenix-feather">
        <div className="slider_content">
          <div className={"l-stageTemplate-banner " + lottery.name}>
            <div className="l-stageTemplate-banner-iconContainer">
              <img
                className="l-stageTemplate-banner-iconContainer-icon"
                src={lottery.image}
                style={{ visibility: "visible" }}
              />
            </div>
            <div className="l-stageTemplate-banner-jackpot">
              <span className="l-stageTemplate-banner-jackpot-currency">
                {lottery.unit}
              </span>
              <span className="l-stageTemplate-banner-jackpot-amount">
                <strong> {formatNumber(lottery.amount)} </strong>
              </span>
            </div>
            <div className="l-stageTemplate-banner-ctaWrapper">
              <span className="l-stageTemplate-banner-ctaWrapper-pitch">
                Buy official lottery tickets online
              </span>
              <Link href={lottery.link}>
                <a className="btn btn-primary stageBtnAlignment">PLAY NOW</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
