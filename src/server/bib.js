const fs = require("fs");

const DIR = "./my-app/src/data/";
const maitrebib = async () => {
  try {
    const michelins = JSON.parse(fs.readFileSync(DIR + "michelin.json"));
    const maitres = JSON.parse(fs.readFileSync(DIR + "maitre.json"));

    const restaurants_maitre_bib = [];
    for (var michelin of michelins) {
      for (var maitre of maitres) {
        if (equals(michelin, maitre)) {
          restaurants_maitre_bib.push({
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

const equals = (michelin, maitre) => {
  try {
    michelin = michelin.name.toLowerCase();
    maitre = maitre.name.toLowerCase();
    return michelin == maitre;
  } catch (error) {
    console.log(error);
  }
};

const toFile = async () => {
  const restaurants = await maitrebib();
  const json = JSON.stringify(restaurants);
  fs.writeFile(DIR + "/maitrebib.json", json, err => {
    if (err) {
      console.log("Bib: Error writing file", err);
    } else {
      console.log("Bib: Successfully wrote file");
    }
  });
};

module.exports.toFile = toFile;
module.exports.maitrebib = maitrebib;
module.exports.DIR = DIR;
