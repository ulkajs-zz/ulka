const { parse } = require("ulka-parser");

const parseUlka = (ulkaTemplate, values) => {
  return {
    html: parse(ulkaTemplate, values),
  };
};

module.exports = parseUlka;
