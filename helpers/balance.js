export const balanceCheck = (balance, bonus, price, ticketType) => {
  if (ticketType === "group") return balance > price;
  else return balance > price;
};
