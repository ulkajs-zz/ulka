const fs = require("fs/promises");
const { absolutePath } = require("../utils");

const createDirectories = async (pathname) => {
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, "");
  return await fs.mkdir(absolutePath(pathname), {
    recursive: true,
  });
};

module.exports = createDirectories;
