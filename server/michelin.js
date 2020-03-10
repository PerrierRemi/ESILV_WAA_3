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
  var restaurants = []
  const root = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand'

  for (let index = 1; index < 20; index++) {

    console.log('Process page ' + index.toString())

    try {
      const url = root.concat('/page/', index.toString())
      const response = await axios(url);
      const { data, status } = response;
      const $ = cheerio.load(data);

      const links = $("a[class='link']")

      if (links.length == 0) break
      else links.each(function () { restaurants.push($(this).attr('href')) })

    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  }
  return restaurants
};
