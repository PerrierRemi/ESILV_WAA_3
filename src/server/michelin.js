const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const ROOT = "https://guide.michelin.com";
const SEARCH = "/fr/fr/restaurants/bib-gourmand/page/";

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
const get = async () => {
  console.log("Michelin: Get urls");
  const urls = await getUrls();
  console.log("Michelin: Get data");
  const restaurants = await scrapeAll(urls);
  console.log("Michelin: All good");
  return restaurants;
};

/**
 * Parse webpage restaurant
 * @return {Array} urls - urls complement of all bib gourmand restaurands
 */
const getUrls = async () => {
  var urls = [];
  index = 1;
  while (true && index < 2) {
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
    } catch (e) {
      console.log(e);
    }
    index++;
  }
  return urls;
};

/**
 * Parse webpage restaurant
 * @param  {Array} urls - urls complement of all bib gourmand restaurands
 * @return {Array} restaurant
 */
const scrapeAll = async urls => {
  restaurants = [];
  for (let url of urls) {
    restaurant = await scrapeRestaurant(ROOT + url);
    restaurants.push(restaurant);
  }
  return restaurants;
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
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);

  const name = $(
    "div.restaurant-details__heading.d-lg-none h2.restaurant-details__heading--title"
  ).text();

  const raw_address = $("ul.restaurant-details__heading--list")
    .text()
    .trim()
    .split("\n")[0]
    .split(", ");

  const address = {
    street: raw_address[0],
    city: raw_address[1],
    department: raw_address[2],
    country: raw_address[3]
  };

  const telephone = $("div.d-flex span.flex-fill")
    .text()
    .substring(0, 17);

  const location = $("div.google-map__static")
    ["0"].children[1].attribs.src.split("=")[2]
    .split(",");

  const image = $("div.masthead__gallery-image")
    .children()
    .first()
    .attr("data-image");

  return { name, address, telephone, location, image };
};

/**
 * Write restaurants list json file
 */
const toFile = async dir => {
  const restaurants = await get();
  const json = JSON.stringify(restaurants);
  fs.writeFile(dir + "/michelin.json", json, err => {
    if (err) {
      console.log("Michelin: Error writing file", err);
    } else {
      console.log("Michelin: Successfully wrote file");
    }
  });
};
module.exports.toFile = toFile;
