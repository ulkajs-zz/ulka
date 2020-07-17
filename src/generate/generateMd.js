const fs = require("fs");
const path = require("path");
const mkdir = require("../fs/mkdir");
const allFiles = require("../fs/allFiles");
const parseMd = require("../parse/parseMd");
const parseUlka = require("../parse/parseUlka");
const configs = require("../parse/parseConfig");
const absolutePath = require("../utils/absolutePath");
const dataFromPath = require("../utils/dataFromPath");

const { contents, templatesPath } = configs;

function generateFromMd() {
  // Get all files having .md extension from contentsPath
  let files;
  try {
    files = allFiles(absolutePath(`src/${contents.path}`), ".md");
  } catch (e) {
    console.log("\n>>", e.message);
    process.exit(1);
  }

  // Get contents inside .md files and parse them
  const fileDatas = files.map(dataFromPath).map((fileData) => ({
    ...fileData,
    data: parseMd(fileData.data),
    relativePath: path.relative(process.cwd(), fileData.path),
  }));

  fileDatas.forEach((mfd) => {
    //  For eg: \index.md or folder\file.md
    const [, filePath] = mfd.path.split(path.join("src", contents.path));

    const parsedPath = path.parse(filePath);

    // For eg: build/blog/post-1/
    let createFilePath =
      configs.buildPath + "/" + contents.generatePath + parsedPath.dir;

    const markdownTemplatePath = absolutePath(
      `src/${templatesPath}/${contents.template}`
    );

    const templateUlkaData = fs.readFileSync(markdownTemplatePath, "utf-8");

    const templateData = parseUlka(templateUlkaData, {
      frontMatter: mfd.data.frontMatter,
      data: mfd.data.html,
      ...configs,
    });

    if (parsedPath.name !== "index") {
      createFilePath += "/" + parsedPath.name;
      parsedPath.name = "index";
    }
    const absoluteFilePath = absolutePath(
      `${createFilePath}/${parsedPath.name}.html`
    );

    mkdir(createFilePath).then(() => {
      fs.writeFileSync(absoluteFilePath, templateData.html);
    });
  });
}

generateFromMd();
