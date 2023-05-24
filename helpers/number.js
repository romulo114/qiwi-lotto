export const formatNumber = (num) => {
  return Math.abs(num) >= 1.0e9
    ? Math.round((Math.abs(num) / 1.0e9) * 10) / 10 + "B"
    : Math.abs(num) >= 1.0e6
    ? Math.round((Math.abs(num) / 1.0e6) * 10) / 10 + "M"
    : Math.abs(num) >= 1.0e3
    ? Math.round((Math.abs(num) / 1.0e3) * 10) / 10 + "K"
    : Math.abs(num);
};

export const numberWithLength = (num, len) => {
  return `${num}`.padStart(len, "0");
};
