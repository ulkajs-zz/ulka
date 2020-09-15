import path from "path"
import fs from "fs"
import "colors"

let ulkaConfigs = {}

try {
  const configExists = fs.existsSync(path.join(process.cwd(), "ulka-config.js"))
  if (configExists) {
    ulkaConfigs = require(path.join(process.cwd(), "ulka-config.js"))
  }
} catch (e) {
  console.log(`>> ${e.message}`.red)
  process.exit(0)
}

const defaultConfigs = {
  siteMetaData: {
    title: "Ulka.Js",
    desription: "UlkaJs - static site generator"
  },
  buildPath: "build",
  pagesPath: "pages",
  templatesPath: "templates",
  plugins: [],
  contents: {
    path: "contents",
    generatePath: "blog",
    template: "blog.ulka"
  }
}

export default {
  ...defaultConfigs,
  ...ulkaConfigs
}
