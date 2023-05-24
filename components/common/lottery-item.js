import Link from "next/link";
import { formatNumber, numberWithLength } from "../../helpers/number";
import { useCountDown } from "../../custom/count-down";

const LotteryItem = (props) => {
  const { id, name, date, image, unit, amount, link } = props;
  const curTime = useCountDown(date);

  return (
    <div
      className={`slide ${name} track`}
      data-track-name="slideWM"
      data-date={date}
      data-number={`${id}`}
    >
      <div className="teaserBox">
        <div
          className="content"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div className="jackpot">
            <span style={{ margin: 0, display: "block" }}>{name}</span>
            <span
              style={{ margin: 0, display: "block" }}
            >{`${unit} ${formatNumber(amount)}`}</span>
          </div>
          <img src={image} style={{ width: "100px" }} />
        </div>
        <div className="footer">
          <div className="countdown">
            {curTime.tm > 0 &&
              `${curTime.days}d ${numberWithLength(
                curTime.hours,
                2
              )}:${numberWithLength(curTime.minutes, 2)}:${numberWithLength(
                curTime.seconds,
                2
              )}`}
            {curTime.tm < 0 && (
              <div className="itemExpired">
                <div className="itemBg">EXPIRED</div>
              </div>
            )}
          </div>
          <Link href={`${link}`}>
            <a className="button goOn">Play Now</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LotteryItem;
