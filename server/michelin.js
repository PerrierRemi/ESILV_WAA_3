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
  while (true) {
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

  var name = $(".section-main h2.restaurant-details__heading--title").text();
  const experience = $("#experience-section > ul > li:nth-child(2)")
    .text()
    .split("\n")[2]
    .trim();
  const scrapedAdress = $(
    ".restaurant-details__heading > ul > li:nth-child(1)"
  ).text();
  const street = scrapedAdress.split(",")[0];
  const city = scrapedAdress.split(",")[1];
  const code = scrapedAdress.split(",")[2].trim();
  const telephone = $(".section-main span.flex-fill")
    .text()
    .substring(0, 17);
  const website = $(".section-main a").attr("href");

  return { name, experience, street, city, code, telephone, website };
};

/**
 * Write restaurants list json file
 */
const toFile = async () => {
  const restaurants = await get();
  const json = JSON.stringify(restaurants);
  fs.writeFile("./json/michelin.json", json, err => {
    if (err) {
      console.log("Michelin: Error writing file", err);
    } else {
      console.log("Michelin: Successfully wrote file");
    }
  });
};
module.exports.toFile = toFile;
