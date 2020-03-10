const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);
  const name = $('.section-main h2.restaurant-details__heading--title').text();
  const experience = $('#experience-section > ul > li:nth-child(2)').text();

  return { name, experience };
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
module.exports.scrapeRestaurant = async url => {
  const response = await axios(url);
  const { data, status } = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = async () => {
  var restaurants = [];
  const url = "https://guide.michelin.com/fr/fr/restaurants/bib-gourmand";

  try {
    console.log("Fetch data");
    const response = await axios(url);
    const { data, status } = response;
    console.log("Data fetched")

    console.log("Load data");
    const $ = cheerio.load(data);

    $("div[class='col-md-6 col-lg-6 col-xl-3']").each(function (i, e) {
      console.log($(this).find('a').attr('href'))
    });

    console.log("It's okay");

  } catch (e) {
    console.log(e)
    process.exit(1)
  }
  return [];
};
