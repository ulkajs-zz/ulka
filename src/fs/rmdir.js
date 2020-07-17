const fs = require("fs/promises");
const path = require("path");
const { absolutePath } = require("../utils");

const removeDirectories = async (pathname) => {
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, "");

  return await fs.rmdir(absolutePath(pathname), {
    recursive: true,
  });
};

module.exports = removeDirectories;
