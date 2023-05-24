import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import LotteryList from "../components/common/lottery-list";
import PlayGroup from "../components/home/play-group";
import LottoResult from "../components/home/lotto-result";
import Loading from "../components/common/loading";
import { ModalDialog } from "../components/dialog";
import { getUserBySysSessionId } from "../service/client/user";
import { getAllDraws, getResultsByBrand } from "../service/globalinfo";
import { parseXmlFile } from "../helpers/xml";
import { parseJsonFile } from "../helpers/json";
import SecurityGroup from "../components/home/security-group";
import Banner from "../components/common/banner";
import * as UserActions from "../store/actions/user";

export default function Home(props) {
  const { banners, lotteries, results } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const { sysSessionID } = router.query;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function autoLogin() {
      if (!sysSessionID) return;

      try {
        setBusy(true);
        const user = await getUserBySysSessionId(sysSessionID);
        await dispatch(UserActions.login(user.Email, user.Password));
      } catch (e) {
        setError(e);
      } finally {
        setBusy(false);
      }
    }

    autoLogin();
  }, [sysSessionID]);

  if (busy) {
    return <Loading />;
  }
  return (
    <Layout>
      <Head>
        <title>Play lotteries online - QIWI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ModalDialog
          show={!!error}
          header={"Error"}
          body={<span className="error-msg">{error}</span>}
          footer={
            <>
              <span />
              <button onClick={() => setError("")} className="btn btn-primary">
                OK
              </button>
            </>
          }
        />
        {/* hero */}
        {/* <Hero lottery={lotteries[0]} /> */}
        <Banner banners={banners} lottery={lotteries[0]} />
        <div className="clear"></div>

        {/* lottery list */}
        <section className="wrap lotto-owl-slider">
          <LotteryList items={lotteries} />
          <Link href="/lottery">
            <a
              href="/lottery"
              className="right"
              style={{ margin: "12px 0 0 0" }}
            >
              View all lotteries &gt;{" "}
            </a>
          </Link>
          <div className="clear"></div>
        </section>
        <div className="clear" />

        {/* middle home */}
        <section id="middle_home">
          <section className="wrap">
            <div className="playgroup-result">
              <PlayGroup />
              <LottoResult items={results} />
            </div>
            <SecurityGroup />
          </section>
        </section>
      </main>
    </Layout>
  );
}

export const getStaticProps = async (ctx) => {
  const banners = await parseJsonFile("data/banners.json");

  try {
    const res = await Promise.all([
      getAllDraws(),
      getResultsByBrand(),
      parseXmlFile("data/news.xml"),
    ]);
    const draws = res[0];
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
            draw.Jackpot < 0
          )
      )
      .filter((draw) => draw.LotteryTypeId !== 45 && draw.LotteryTypeId !== 46)
      .map((draw) => ({
        id: draw.DrawId,
        name: draw.LotteryName,
        date: draw.DrawDate,
        image: `/images/logos/${draw.LotteryName.toLowerCase()}1.png`,
        unit: draw.LotteryCurrency2,
        amount: draw.Jackpot,
        link: `/lotteries/${draw.LotteryName.replace(/ /g, "").toLowerCase()}`,
        country: draw.CountryName,
        flag: `/images/flag_${draw.CountryName.toLowerCase()}.png`,
      }));

    const megaJack = draws.find((draw) => draw.LotteryName === "MegaJackpot");
    const powerPlay = draws.find(
      (draw) => draw.LotteryName === "BTC Power Play"
    );
    const exlottos = [
      {
        id: megaJack?.DrawId ?? -1,
        name: "BTC Jackpot",
        desc: "Daily Draw 9am CET",
        date: megaJack?.DrawDate ?? "",
        image: `/images/megajackpot1.png`,
        unit: megaJack?.LotteryCurrency2 ?? "$",
        link: "/lotteries/megajackpot",
        country: megaJack?.CountryName ?? "US",
        amount: 1000000,
        daily: "Daily",
      },
      {
        id: powerPlay?.DrawId ?? -1,
        name: "BTC Power Play",
        desc: "Draw every 5 Minutes",
        date: powerPlay?.DrawDate ?? "",
        image: `/images/btcpowerplay1.png`,
        unit: powerPlay?.LotteryCurrency2 ?? "$",
        link: "/lotteries/btcpowerplay",
        country: powerPlay?.CountryName ?? "US",
        amount: 100,
        daily: "",
      },
    ];

    const raffles = draws
      .filter((draw) => draw.LotteryName.includes("Raffle") && draw.Jackpot > 0)
      .map((draw) => ({
        id: draw.DrawId,
        type: draw.LotteryTypeId,
        name: draw.LotteryName,
        image: `/images/441_Box${draw.LotteryTypeId - 35}.png`,
        unit: draw.LotteryCurrency2,
        amount: parseInt(draw.Jackpot) === 20000 ? 25000 : draw.Jackpot,
        price: draw.PricePerLine,
        link: `/btcraffles/${draw.LotteryTypeId}`,
      }))
      .sort((a, b) => a.amount - b.amount);

    const results = res[1]
      .filter(
        (item) =>
          item.LotteryTypeId !== 13 &&
          item.LotteryTypeId !== 24 &&
          !!item.WinningResult &&
          item.LotteryTypeId !== 27 &&
          item.LotteryTypeId !== 34 &&
          item.LotteryTypeId !== 35
      )
      .map((item) => {
        let scores = null;
        const arr = item.WinningResult.split(/,|#/g);
        if (arr.length <= 1) scores = +item.WinningResult;
        else {
          let arr = item.WinningResult.split("#");
          scores = arr[0].split(",").map((item) => ({
            color: "blue",
            value: parseInt(item),
          }));
          arr[1].length > 0 &&
            arr[1].split(",").forEach((item) => {
              scores.push({ color: "green", value: parseInt(item) });
            });
        }
        return {
          name: item.LotteryName,
          image: item.LotteryName.includes("Raffle")
            ? null
            : `/images/logos/${item.LotteryName.toLowerCase()}1.png`,
          country: item.CountryName,
          date: item.LocalDrawDateTime,
          earned: { unit: item.LotteryCurrency, amount: item.RollOver },
          scores,
        };
      });

    return {
      props: {
        banners: banners.items,
        lotteries,
        exlottos,
        raffles,
        results,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        banners: banners.items,
        lotteries: [],
        exlottos: [],
        results: [],
        raffles: [],
      },
      revalidate: 10,
    };
  }
};
