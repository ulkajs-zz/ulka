const fs = require("fs/promises");
const absolutePath = require("../utils/absolutePath");

const createDirectories = async (pathname) => {
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, "");
  return await fs.mkdir(absolutePath(pathname), {
    recursive: true,
  });
};

createDirectories("src/pages");

module.exports = createDirectories;
