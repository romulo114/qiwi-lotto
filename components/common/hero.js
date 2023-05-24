import Link from "next/link";
import { formatNumber } from "../../helpers/number";

const Hero = ({ lottery }) => {
  return (
    <div id="main" className="clearfix">
      <div
        className="phoenix-slider hidden-xs"
        style={{
          display: "flex",
          justifyContent: "center",
          height: "757px",
        }}
      >
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
                {/* <span className="l-stageTemplate-banner-jackpot-million">
                  <span className="l-stageTemplate-banner-jackpot-translation">
                    Million
                  </span>
                </span> */}
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
        <img
          src="/images/home-blue-banner.jpg"
          style={{ height: "410px", visibility: "visible" }}
          alt=""
          className="loto_banner"
        />
      </div>
    </div>
  );
};
export default Hero;
