const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const bib = require("./bib");

const DIR = bib.DIR;
const ROOT = "https://guide.michelin.com";
const SEARCH = "/fr/fr/restaurants/bib-gourmand/page/";

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
const get = async () => {
  // Get restaurants pages urls from search result pages
  console.log("Michelin: Get urls");
  const urls = await getUrls();
  // Get data from the restaurants pages
  console.log("Michelin: Get data");
  const restaurants = await scrapeAll(urls);

  return restaurants;
};

/**
 * Parse webpage restaurant
 * @return {Array} urls - urls complement of all bib gourmand restaurands
 */
const getUrls = async () => {
  var urls = [];
  // Index of the search result page
  index = 1;
  while (true) {
    try {
      // Get HTML and load it in a object
      const url = ROOT + SEARCH + index;
      const response = await axios(url);
      const { data, status } = response;
      const $ = cheerio.load(data);

      // All restaurant links in the page are identified by their class 'link'
      const links = $("a[class='link']");

      // If there are no links in this pages, we are not anymore in search results pages, the scrapping is over
      if (links.length == 0) break;
      // Else we store all links presents on this page
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
  // For each urls, scrap the associated restaurant page
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
    "div.restaurant-details__heading.d-lg-none > h2.restaurant-details__heading--title"
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
const toFile = async () => {
  // Get data
  const restaurants = await get();
  const json = JSON.stringify(restaurants);
  // Write data
  fs.writeFile(DIR + "/michelin.json", json, err => {
    if (err) {
      console.log("Michelin: Error writing file", err);
    } else {
      console.log("Michelin: Successfully wrote file");
    }
  });
};

// Export
module.exports.toFile = toFile;
