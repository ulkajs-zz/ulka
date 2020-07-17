const path = require("path");

const absolutePath = (args) => path.join(process.cwd(), ...args.split("/"));

module.exports = absolutePath;
