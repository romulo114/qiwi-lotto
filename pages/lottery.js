import React, { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../components/layout";
import format from "format-number";
import { getAllDraws } from "../service/globalinfo";
import { formatDate } from "../helpers/dateformat";

const formatter = format();
export default function LotteryPage({ lotteries }) {
  const router = useRouter();
  return (
    <Layout>
      <main id="main" className="clearfix">
        <div className="wrap">
          <div id="middle" className="innerbg view-all-lottery">
            <div className="innerpage">
              <div className="all-lot-title">
                <h1>Purchase Your Official Lottery Tickets:</h1>
              </div>
              <div className="allresult_table">
                <table
                  id="myTable"
                  className="tablesorter lotteries-table"
                  border="0"
                  cellPadding="0"
                  cellSpacing="1"
                >
                  <thead>
                    <tr>
                      <th className="header">Country</th>
                      <th className="header lottery">Lottery</th>
                      <th className="header">Next draw</th>
                      <th className="header">Jackpot</th>
                    </tr>
                  </thead>
                  <tbody className="allbrands">
                    {lotteries &&
                      lotteries.map((item) => (
                        <Fragment key={item.id}>
                          <tr onClick={() => router.push(item.link)}>
                            <td>
                              <img src={item.flag} />
                              &nbsp;{item.country}
                            </td>
                            <td className="lottery">{item.name}</td>
                            <td>
                              {formatDate(
                                new Date(parseInt(item.date)),
                                "dd/mm/yyyy"
                              )}
                            </td>
                            <td>
                              <div>
                                {`${item.unit} ${formatter(item.amount)}`}
                                <Link href={`${item.link}`}>
                                  <a
                                    className="dd_play_button"
                                    style={{ float: "right" }}
                                  >
                                    Play Now
                                  </a>
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr className="spacer"></tr>
                        </Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="clear_inner">&nbsp;</div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export const getStaticProps = async (ctx) => {
  try {
    const draws = await getAllDraws();
    const lotteries = draws
      .filter(
        (draw) =>
          !(
            draw.LotteryName == "BTC Power Play" ||
            draw.LotteryName == "MegaJackpot" ||
            draw.LotteryName == "BTC Raffle 50" ||
            draw.LotteryName == "BTC Raffle 100" ||
            draw.LotteryName == "BTC Raffle 200" ||
            draw.LotteryName == "BTC Raffle 500" ||
            draw.LotteryName == "BTC Raffle 1000" ||
            draw.LotteryName == "BTC Raffle 2500" ||
            draw.LotteryName == "BTC Raffle 5000" ||
            draw.LotteryName == "BTC Raffle 10000" ||
            draw.LotteryName == "BTC Raffle 20000" ||
            draw.LotteryName == "BTC Raffle 25" ||
            draw.LotteryName == "BTC Raffle" ||
            draw.Jackpot < 0 ||
            draw.LotteryName == "BTC Raffle 25000"
          )
      )
      .filter((draw) => draw.LotteryTypeId !== 45 && draw.LotteryTypeId !== 46)
      .map((draw) => ({
        id: draw.DrawId,
        name: draw.LotteryName,
        date: new Date(draw.DrawDate).getTime(),
        image: `/images/${draw.LotteryName.toLowerCase()}1.png`,
        unit: draw.LotteryCurrency2,
        amount: draw.Jackpot,
        link: `/lotteries/${draw.LotteryName.replace(/ /g, "").toLowerCase()}`,
        country: draw.CountryName,
        flag: `/images/flag_${draw.CountryName.toLowerCase()}.png`,
      }));
    return {
      props: {
        lotteries,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        lotteries: [],
      },
      revalidate: 10,
    };
  }
};
