const michelin = require("./michelin");

const main = async () => {
  const urls = await michelin.get();
  const restaurants = await urls.forEach(element =>
    michelin.scrapeRestaurant(element)
  );
};

main();
