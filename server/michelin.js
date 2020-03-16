const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const ROOT = "https://guide.michelin.com";
const SEARCH = "/fr/fr/restaurants/bib-gourmand/page/";

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);

  const name = $(
    "div.restaurant-details div.container div.row div.col-xl-4 div.restaurant-details__heading.d-lg-none h2.restaurant-details__heading--title"
  ).text();
  const address = $(
    "div.restaurant-details__heading ul.restaurant-details__heading--list"
  )
    .text()
    .trim()
    .split("\n")[0];
  const tel = $(".section-main div.row div.d-flex span.flex-fill")
    .text()
    .substring(0, 17);
  const position = $(".section-main div.row div.google-map__static")
    ["0"].children[1].attribs.src.split("=")[2]
    .split(",");

  return { name: name, address: address, tel: tel, position: position };
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
  } catch (e) {
    console.log(e);
  }
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
const get = async () => {
  const urls = await getUrls();
  const restaurants = await scrapeAll(urls);
  return restaurants;
};

const getUrls = async () => {
  var urls = [];
  index = 1;
  while (index < 2) {
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
  return urls;
};

const scrapeAll = async urls => {
  restaurants = [];
  for (let url of urls) {
    restaurant = await scrapeRestaurant(ROOT + url);
    restaurants.push(restaurant);
  }
  return restaurants;
};

const toFile = async () => {
  const restaurants = await get();
  const json = JSON.stringify(restaurants);
  fs.writeFile("./json/michelin.json", json, err => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
};

module.exports.get = get;
module.exports.toFile = toFile;
