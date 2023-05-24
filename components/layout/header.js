import { useCallback, useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

import * as UserActions from "../../store/actions/user";
import * as AuthActions from "../../store/actions/auth";

// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const [nav, setNav] = useState(false);
  const [mounted, setMounted] = useState(false);

  const toggleNav = useCallback(() => setNav(!nav), [nav]);
  const cls = useMemo(() => (nav ? "show-nav clearfix" : "clearfix"), [nav]);
  const profile = useSelector((state) => state.user.profile);
  const balance = useSelector((state) => state.user.balance);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRefresh = useCallback(() => {
    if (profile?.MemberId) {
      dispatch(UserActions.getBalance(profile?.MemberId));
    }
  }, [profile?.MemberId]);
  const handleLogout = useCallback(() => {
    dispatch(UserActions.logout());
    dispatch(AuthActions.clearCredentials());
    router.push("/");
  }, []);

  useEffect(() => {
    setMounted(true);
    jQuery(".contact-us-modal").on("click", function () {
      jQuery("#contact-us-modal").modal({
        fadeDuration: 300,
      });
    });

    jQuery("#contact-us-modal .fa-close").on("click", function () {
      jQuery("#contact-us-modal a.close-modal").click();
    });

    jQuery(".arrow_down_button").on("click", function () {
      if (jQuery(this).closest("li.has-child.mobile-menu").hasClass("active")) {
        jQuery("li.has-child.mobile-menu").removeClass("active");
      } else {
        jQuery("li.has-child.mobile-menu").removeClass("active");
        jQuery(this).closest("li.has-child.mobile-menu").addClass("active");
      }
    });

    return () => setMounted(false);
  }, []);

  return (
    <header id="header" className={cls}>
      <div className="menu">
        <div className="wrap">
          <div className="left_menu">
            <Link href="/">
              <a className="logo">LWG</a>
            </Link>
            <ul id="menu-header-menu" className="top-menu">
              <li className="lottary-play show-dd menu-item menu-item-type-post_type menu-item-object-page menu-item-1395">
                <Link href="/lottery">Lottery</Link>
              </li>
              <li className="lottary-info show-dd menu-item menu-item-type-post_type menu-item-object-page menu-item-1394">
                <Link href="/lottery-results">Results</Link>
              </li>
              <li className="nav-item menu-item menu-item-type-post_type menu-item-object-page menu-item-1382">
                <Link href="/support">Support</Link>
              </li>
            </ul>
          </div>
          <div className="right_menu">
            {profile && mounted ? (
              <div className="rsm-dropdown" style={{ marginRight: 32 }}>
                <div className="rsm-dropdown-box">
                  <div className="rsm-avatar">
                    {profile.FirstName && profile.LastName
                      ? `${profile.FirstName.charAt(
                          0
                        )}${profile.LastName.charAt(0)}`.toUpperCase()
                      : profile.MemberId}
                  </div>
                  <div>
                    <div className="rsm-account-username">
                      {profile.FirstName && profile.LastName
                        ? `${profile.FirstName} ${profile.LastName}`
                        : "Player " + profile.MemberId}
                    </div>
                    <div className="rsm-account-balance">
                      {balance && (
                        <span>{`Balance: € ${(
                          balance.AccountBalance +
                          balance.BonusAmount +
                          balance.WinningAmount
                        ).toFixed(2)}`}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="rsm-dropdown-content">
                  <Link href="/user/me">
                    <a>
                      <i className="fa fa-user"></i>
                      {`My Account (ID: ${profile.MemberId})`}
                      <br />
                      <span>{`Real Money: € ${balance?.AccountBalance.toFixed(
                        2
                      )}`}</span>
                      <br />
                      <span>{`Bonus Money: € ${balance?.BonusAmount.toFixed(
                        2
                      )}`}</span>
                    </a>
                  </Link>
                  <Link href="/user/deposit">
                    <a>
                      <i className="fa fa-money-bill"></i>Deposit
                    </a>
                  </Link>
                  <Link href="/user/withdraw">
                    <a>
                      <i className="fa fa-credit-card"></i>Withdraw
                    </a>
                  </Link>
                  <Link href="/">
                    <a onClick={handleRefresh}>
                      <i className="fa fa-redo"></i>Balance Refresh
                    </a>
                  </Link>
                  <a href="#" onClick={handleLogout}>
                    <i className="fa fa-sign-out-alt"></i>Log out
                  </a>
                </div>
              </div>
            ) : (
              <div className="login-register">
                <Link href="/auth/login">
                  <a className="signin show-sign-in">
                    <i className="fas fa-sign-in-alt"></i>Log in
                  </a>
                </Link>
                <Link href="/auth/signup">
                  <a className="register show-sign-up">
                    <i className="fas fa-edit"></i>Register
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="wrap new_header_mobile_menu">
        <Link href="/">
          <a className="logo">LWG</a>
        </Link>
        <a
          data-href="nav"
          className="mobile-trigger trigger-nav"
          onClick={toggleNav}
        >
          <i>
            <span className="line-1"></span>
            <span className="line-2"></span>
            <span className="line-3"></span>
          </i>
        </a>
        <div id="menu-container">
          <ul className="wrap-top-menu">
            <li>
              <Link href="/lottery">Lottery</Link>
            </li>
            <li>
              <Link href="/lottery-results">Results</Link>
            </li>
            <li>
              <Link href="/support">Support</Link>
            </li>
            {profile && mounted ? (
              <>
                <li>
                  <Link href="/user/me">
                    <a>
                      {`My Account (ID: ${profile.MemberId})`}
                      <br />
                      <span>{`Real Money: € ${balance?.AccountBalance.toFixed(
                        2
                      )}`}</span>
                      <br />
                      <span>{`Bonus Money: € ${balance?.BonusAmount.toFixed(
                        2
                      )}`}</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <a href="#" onClick={handleLogout}>
                    Log out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login">
                    <a className="button">
                      <i className="fas fa-sign-in-alt"></i>Log in
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup">
                    <a className="button">
                      <i className="fas fa-sign-in-alt"></i>Register
                    </a>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
