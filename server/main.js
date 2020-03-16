const michelin = require("./michelin");

const main = async () => {
  michelin.get().then(console.log);
};

main();
