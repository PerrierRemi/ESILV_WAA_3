const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const querystring = require("querystring");

const SEARCH = "https://www.maitresrestaurateurs.fr/profil/";

/**
 * Get all France located Maitre Restaurateur restaurants
 * @return {Array} restaurants
 */
const get = async () => {
  restaurants = [];
  index = 1;
  empty_pages_in_a_row = 0;
  while (true) {
    console.log("Restaurant: " + index);
    const restaurant = await scrapeRestaurant(SEARCH + index);

    if (restaurant != null) {
      restaurants.push(restaurant);
      empty_pages_in_a_row = 0;
    } else empty_pages_in_a_row++;

    if (empty_pages_in_a_row > 3) break;
    index++;
  }
  return restaurants;
};

/**
 * Scrape a given restaurant url
 * @param  {int}  index
 * @return {Object} restaurant
 */
const scrapeRestaurant = async url => {
  try {
    const response = await axios(url);
    const { data, status } = response;
    return parse(data);
  } catch (e) {
    return undefined;
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
  try {
    var coordinates = $(
      "#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5"
    )
      .text()
      .split("\n");
    const name = coordinates[2].trim();
    const street = coordinates[11].trim();
    const city = coordinates[15].trim();
    const code = coordinates[14].trim();
    const telephone = coordinates[28].trim();
    const website = coordinates[31].trim();

    return { name, street, city, code, telephone, website };
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Write restaurants list json file
 */
const toFile = async dir => {
  const restaurants = await get();
  const json = JSON.stringify(restaurants);
  fs.writeFile(dir + "/maitre.json", json, err => {
    if (err) {
      console.log("Maitre: Error writing file", err);
    } else {
      console.log("Maitre: Successfully wrote file");
    }
  });
};
module.exports.toFile = toFile;
