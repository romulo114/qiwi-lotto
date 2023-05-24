import LotteryItem from "./lottery-item";
import { OwlCarousel } from "./carousel";

const LotteryList = ({ items }) => (
  <OwlCarousel
    id="owl-demo"
    items={items}
    count={5}
    component={LotteryItem}
    responsive={{
      0: {
        items: 1,
        nav: true,
        loop: true,
      },
      600: {
        items: 2,
        nav: false,
        loop: true,
      },
      1024: {
        items: 3,
        nav: true,
        loop: true,
      },
      1440: {
        items: 3,
        nav: true,
        loop: true,
      },
      1600: {
        items: 3,
        nav: true,
        loop: true,
      },
    }}
  />
);

export default LotteryList;
