import fs from "fs"
import path from "path"
import mkdir from "./mkdir"
import allFiles from "./allFiles"
import absolutePath from "../utils/absolutePath"
import generateFileName from "../utils/generateName"
import parseUlka from "../parse/parseUlka"
import globalInfo from "../globalInfo"

const configs = globalInfo.configs

const parseUrlPath = (css: string, f: string) => {
  return css.replace(/ url\((.*?)\)/gs, (...args) => {
    const pathGiven = args[1].replace(/'|"/gs, "")

    if (pathGiven.startsWith("http")) return ` url("${pathGiven}")`

    const fileName = generateFileName(path.join(f, pathGiven))

    return ` url("${fileName + path.parse(pathGiven).ext}")`
  })
}

const copyAssets = async (
  dir = path.join(process.cwd(), "src"),
  to = "build"
) => {
  await mkdir(`${to}/__assets__`)
  const files = allFiles(dir)
    .map((f: string) => path.parse(f))
    .filter((f: path.ParsedPath) => f.ext !== ".ulka" && f.ext !== ".md")
    .forEach(async (f: path.ParsedPath) => {
      const assetExt = f.ext === ".ucss" ? ".css" : f.ext

      const writePath =
        absolutePath(
          configs.buildPath + "/__assets__/" + generateFileName(path.format(f))
        ) + assetExt

      let readAssetsFile
      if (assetExt === ".css") {
        readAssetsFile = (
          await parseUlka(
            fs.readFileSync(path.format(f)),
            globalInfo,
            writePath
          )
        ).html
        readAssetsFile = parseUrlPath(readAssetsFile as string, f.dir)
      } else {
        readAssetsFile = fs.readFileSync(path.format(f))
      }

      fs.writeFileSync(writePath, readAssetsFile)
    })
  return files
}

export default copyAssets
