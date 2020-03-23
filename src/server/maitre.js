const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const bib = require("./bib");

const DIR = bib.DIR;
const SEARCH = "https://www.maitresrestaurateurs.fr/profil/";

/**
 * Get all France located Maitre Restaurateur restaurants
 * @return {Array} restaurants
 */
const get = async () => {
  restaurants = [];
  // Index of the restaurant profil
  index = 1;
  // Number of non-existant in a row, used to detect end
  empty_pages_in_a_row = 0;
  while (true) {
    console.log("Restaurant: " + index);
    const restaurant = await scrapeRestaurant(SEARCH + index);
    // Some profil are non-existant (deleted)
    if (restaurant != null) {
      restaurants.push(restaurant);
      empty_pages_in_a_row = 0;
    } else empty_pages_in_a_row++;

    // If we encounter three non-existant profiles in a row we consider it's the end
    if (empty_pages_in_a_row > 3) break;
    index++;
  }

  // Some restaurant have multiples profiles, we conserve the most recent
  clean_restaurants = [];
  for (var restaurant of restaurants.reverse()) {
    is_unique = true;
    for (var clean_restaurant of clean_restaurants) {
      if (restaurant.name == clean_restaurant.name) is_unique = false;
    }
    if (is_unique) clean_restaurants.push(restaurant);
  }
  return clean_restaurants;
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
    console.log(e);
    return undefined;
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
    const department = coordinates[14].trim();
    const telephone = coordinates[28].trim();
    const website = coordinates[31].trim();

    return { name, address: { street, city, department }, telephone, website };
  } catch (e) {
    // coordiantes is undefined -> empty profil, return null
    console.log(e);
    return null;
  }
};

/**
 * Write restaurants list json file
 */
const toFile = async () => {
  // Get data
  const restaurants = await get();
  const json = JSON.stringify(restaurants);
  // Write data
  fs.writeFile(DIR + "/maitre.json", json, err => {
    if (err) {
      console.log("Maitre: Error writing file", err);
    } else {
      console.log("Maitre: Successfully wrote file");
    }
  });
};
module.exports.toFile = toFile;
