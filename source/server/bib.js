const fs = require("fs");
var stringSimilarity = require("string-similarity");

const DIR = "./my-app/src/data/";

/**
 * Parse webpage restaurant
 * @return {Array} - french maitre restaurateur with bib gourmand distinction
 */
const maitrebib = async () => {
  try {
    // Read files and convert them to object
    const michelins = JSON.parse(fs.readFileSync(DIR + "michelin.json"));
    const maitres = JSON.parse(fs.readFileSync(DIR + "maitre.json"));

    const restaurants_maitre_bib = [];

    // We compare all michelins to all maitres
    for (var michelin of michelins) {
      for (var maitre of maitres) {
        // If there are the same restaurants
        if (equals(michelin, maitre)) {
          restaurants_maitre_bib.push({
            // We create a new restaurant object with data from both
            name: michelin.name,
            address: michelin.address,
            location: michelin.location,
            image: michelin.image,
            telephone: maitre.telephone,
            website: maitre.website
          });
        }
      }
    }
    return restaurants_maitre_bib;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Parse webpage restaurant
 * @param  {Object} michelin - michelin restaurant
 * @param  {Object} maitre - maitre restaurant
 * @return {Bool} - true if there are the same restaurant, else return false
 */
const equals = (michelin, maitre) => {
  try {
    michelin_name = michelin.name.toLowerCase();
    maitre_name = maitre.name.toLowerCase();
    // Equality test made on names similarity and department
    return (
      (stringSimilarity.compareTwoStrings(michelin_name, maitre_name) > 0.8) &
      (michelin.address.department == maitre.address.department)
    );
  } catch (error) {
    console.log(error);
  }
};

/**
 * Write restaurants list json file
 */

const toFile = async () => {
  // Filter data
  const restaurants = await maitrebib();
  const json = JSON.stringify(restaurants);
  // Write data
  fs.writeFile(DIR + "/maitrebib.json", json, err => {
    if (err) {
      console.log("Bib: Error writing file", err);
    } else {
      console.log("Bib: Successfully wrote file");
    }
  });
};

module.exports.toFile = toFile;
module.exports.DIR = DIR;
