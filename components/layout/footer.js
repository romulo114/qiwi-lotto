import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="wrap center-mid">
        <div className="footer_part2">
          <div className="footer_part2_right">
            <div className="footer_nav">
              <ul>
                <li>
                  <a className="footerheading">
                    <h1>Company</h1>
                  </a>
                </li>
                <div className="menu-support-container">
                  <ul id="menu-support" className="menu">
                    <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1383">
                      <Link href="/about-us/">About us</Link>
                    </li>
                    <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1384">
                      <Link href="/privacy/">Privacy Policy</Link>
                    </li>
                    <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1385">
                      <Link href="/terms/">Terms &amp; Conditions</Link>
                    </li>
                  </ul>
                </div>
              </ul>
              <ul>
                <li>
                  <Link
                    href="/winning-powerball-numbers-saturday/"
                    className="footerheading"
                  >
                    <h1>Play Lottery</h1>
                  </Link>
                </li>
                <div className="menu-play-lottery-container">
                  <ul id="menu-play-lottery" className="menu">
                    <li
                      id="menu-item-1390"
                      className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1390"
                    >
                      <Link href="/lotteries/megamillions">
                        Play MegaMillions
                      </Link>
                    </li>

                    <li
                      id="menu-item-1392"
                      className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1392"
                    >
                      <Link href="/lotteries/powerball">Play PowerBall</Link>
                    </li>
                    <li
                      id="menu-item-1389"
                      className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1389"
                    >
                      <Link href="/lotteries/lotto649">Play Lotto649</Link>
                    </li>
                  </ul>
                </div>
              </ul>
              <ul>
                <li>
                  <a href="#" className="footerheading">
                    <h1>Contact Us</h1>
                  </a>
                </li>
                <div className="contactus-pic">
                  <a href="/">
                    <img
                      src="/images/chat_icon.png"
                      style={{ visibility: "visible" }}
                    />
                    Live Chat
                  </a>
                  <a href="mailto:support@qiwilotto.com">
                    <img
                      src="/images/mail_icon.png"
                      style={{ visibility: "visible" }}
                    />
                    Write Us
                  </a>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer_down">
        <div className="wrap">
          <div className="footer_part1">
            <div className="footerpayments inline">
              <img
                src="/images/logobar-visa_Footer.png"
                alt="Visa payment"
                style={{ visibility: "visible" }}
              />
            </div>
            <div className="footerpayments inline">
              <img
                src="/images/MasterCard_Logo_Footer.png"
                alt="Master card payment"
                style={{ visibility: "visible" }}
              />
            </div>
            <div className="footerpayments inline">
              <img
                src="/images/btc.png"
                alt="BTC"
                style={{ visibility: "visible" }}
              />
            </div>
            <div className="footerpayments inline">
              <img
                src="/images/bch.png"
                alt="BCH"
                style={{ visibility: "visible" }}
              />
            </div>
            <div className="footerpayments inline">
              <img
                src="/images/usdt.png"
                alt="USDT"
                style={{ visibility: "visible" }}
              />
            </div>
          </div>
        </div>

        <iframe
          id="dynamic_fire_pixel"
          width="1px"
          height="1px"
          src=""
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </div>
      <div className="footer_part3">
        <div className="copyright">
          <p>
            <Link href="/" target="_blank">
              www.qiwilotto.com
            </Link>
            &nbsp;
            <span id="Label17">is owned and operated by QIWI LOTTO GROUP.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
