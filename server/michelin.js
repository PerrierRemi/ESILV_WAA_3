const axios = require("axios");
const cheerio = require("cheerio");
const ROOT = "https://guide.michelin.com";
const SEARCH = "/fr/fr/restaurants/bib-gourmand/page/";

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
  return restaurant;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
const scrapeRestaurant = async url => {
  try {
    const response = await axios(url);
    const { data, status } = response;
    return parse(data);
  } catch {}
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = async () => {
  var urls = [];
  index = 1;
  while (true) {
    console.log("Michelin: get search page " + index.toString());
    try {
      const url = ROOT + SEARCH + index;
      const response = await axios(url);
      const { data, status } = response;
      const $ = cheerio.load(data);

      const links = $("a[class='link']");

      if (links.length == 0) break;
      else
        links.each(function() {
          urls.push($(this).attr("href"));
        });
      index++;
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }
  // From the urls scrap the restaurants pages
  Promise.all(
    urls.map(async url => {
      scrapeRestaurant(url);
    })
  );
  return urls;
};
