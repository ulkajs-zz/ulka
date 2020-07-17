const fs = require("fs");
const path = require("path");

const dataFromFilePath = (path) => {
  return {
    data: fs.readFileSync(path, "utf-8"),
    path,
  };
};

const absolutePath = (args) => path.join(process.cwd(), ...args.split("/"));

module.exports = {
  absolutePath,
  dataFromFilePath,
};
