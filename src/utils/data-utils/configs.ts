import "colors"
import path from "path"
import fs from "fs"

let ulkaConfigs: { [key: string]: string | any } = {}

try {
  const configExists = fs.existsSync(path.join(process.cwd(), "ulka-config.js"))
  if (configExists)
    ulkaConfigs = require(path.join(process.cwd(), "ulka-config.js"))
} catch (e) {
  console.log(`>> ${e.message}`.red)
  process.exit(0)
}

const defConfig = {
  buildPath: "build",
  pagesPath: "pages",
  templatesPath: "templates",
  contents: [],
  plugins: []
}

const config = { ...defConfig, ...ulkaConfigs }

export default config
