import fs from "fs"
import path from "path"

import { mkdir } from "."
import allFiles from "./all-files"
import globalInfo from "../globalInfo"
import { absolutePath } from "../utils/path-utils"
import { generateFileName } from "../utils/ulka-utils"

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
    .forEach((f: path.ParsedPath) => {
      const assetExt = f.ext === ".ucss" ? ".css" : f.ext

      const writePath =
        absolutePath(
          configs.buildPath + "/__assets__/" + generateFileName(path.format(f))
        ) + assetExt

      let readAssetsFile
      if (assetExt === ".css") {
        readAssetsFile = fs.readFileSync(path.format(f), "utf-8")
        readAssetsFile = parseUrlPath(readAssetsFile, f.dir)
      } else {
        readAssetsFile = fs.readFileSync(path.format(f))
      }

      fs.writeFileSync(writePath, readAssetsFile)
    })
  return files
}

export default copyAssets
