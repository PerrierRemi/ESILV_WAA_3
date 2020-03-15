const axios = require("axios");
const cheerio = require("cheerio");
const ROOT = "https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/";

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);

  const name = $(".section-main h2.restaurant-details__heading--title").text();

  const restaurant = {
    name: name
  };
  console.log(restaurant);
  return restaurant;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
module.exports.scrapeRestaurant = async url => {
  try {
    const response = await axios(url);
    const { data, status } = response;
    console.log(url);
    return parse(data);
  } catch {}
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = async () => {
  var restaurants = [];

  for (let index = 1; index < 20; index++) {
    console.log("Process page " + index.toString());

    try {
      const url = ROOT + "/page/" + index;
      const response = await axios(url);
      const { data, status } = response;
      const $ = cheerio.load(data);

      const links = $("a[class='link']");

      if (links.length == 0) break;
      else
        links.each(function() {
          restaurants.push(
            "https://guide.michelin.com/" + $(this).attr("href")
          );
        });
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }
  return restaurants;
};
