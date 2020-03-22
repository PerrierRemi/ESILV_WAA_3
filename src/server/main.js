const michelin = require("./michelin");
const maitre = require("./maitre");
const bib = require("./bib");

const DIR = bib.DIR;

const main = async () => {
  bib.toFile();
};

main();
