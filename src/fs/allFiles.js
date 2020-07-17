const fs = require("fs");
const path = require("path");

const allFiles = function (dirPath, ext, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const pathTo = path.join(dirPath, file);
    if (fs.statSync(pathTo).isDirectory()) {
      arrayOfFiles = allFiles(pathTo, ext, arrayOfFiles);
    } else {
      if (!ext || file.endsWith(ext)) arrayOfFiles.push(pathTo);
    }
  });

  return arrayOfFiles;
};

module.exports = allFiles;
