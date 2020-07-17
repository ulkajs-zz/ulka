const fs = require("fs");

const dataFromPath = (path) => {
  return {
    data: fs.readFileSync(path, "utf-8"),
    path,
  };
};

module.exports = dataFromPath;
