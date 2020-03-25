const michelin = require("./michelin");
const maitre = require("./maitre");
const bib = require("./bib");

const DIR = bib.DIR;

const main = async () => {
  await michelin.toFile(DIR);
  await maitre.toFile(DIR);
  await bib.toFile();
  return "main: finish";
};

main();
