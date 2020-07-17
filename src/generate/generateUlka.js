const fs = require("fs");
const path = require("path");
const configs = require("../parse/parseConfig");
const allFiles = require("../fs/allFiles");
const absolutePath = require("../utils/absolutePath");
const dataFromPath = require("../utils/dataFromPath");
const parseUlka = require("../parse/parseUlka");
const mkdir = require("../fs/mkdir");

let files;
try {
  files = allFiles(absolutePath(`src/${configs.pagesPath}`), ".ulka");
} catch (e) {
  console.log("\n>>", e.message);
  process.exit(1);
}

const fileDatas = files.map(dataFromPath).map((fileData) => ({
  ...fileData,
  data: parseUlka(fileData.data, { ...configs }),
  relativePath: path.relative(process.cwd(), fileData.path),
}));

function generateFromUlka() {
  fileDatas.map((ufd) => {
    try {
      const [, filePath] = ufd.path.split(path.join("src", configs.pagesPath));
      const parsedPath = path.parse(filePath);
      let createFilePath = configs.buildPath + parsedPath.dir;

      if (parsedPath.name !== "index") {
        createFilePath += "/" + parsedPath.name;
        parsedPath.name = "index";
      }
      const absoluteFilePath = absolutePath(
        `${createFilePath}/${parsedPath.name}.html`
      );

      mkdir(createFilePath).then((_) =>
        fs.writeFileSync(absoluteFilePath, ufd.data.html)
      );
    } catch (e) {
      console.log("\n>> Error while generating ", ufd.path);
      console.log(">>", e.message);
      process.exit(1);
    }
  });
}

generateFromUlka();

module.exports = generateFromUlka;
