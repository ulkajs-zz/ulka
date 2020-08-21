import fs from "fs"
import path from "path"
import globalInfo from "../globalInfo"

import generateFileName from "../utils/generateName"
import parseUlkaWithPlugins from "../utils/parseUlkaWithPlugins"
import { beforeUlkaParse, afterUlkaParse } from "./parsePlugins"

const $assets = (rPath: string, filePath: string) => {
  // Generate hash of required file
  const fileName = generateFileName(path.join(path.parse(filePath).dir, rPath))

  // Check extension of required file
  const ext = path.parse(rPath).ext === ".ucss" ? ".css" : path.parse(rPath).ext

  // Return hashed fileName path
  return path.join(path.sep, "__assets__", fileName) + ext
}

const $importUlka = async (rPath: string, values: any, filePath: string) => {
  const ulkaFile = path.join(path.parse(filePath).dir, rPath)
  return (
    await parseUlka(
      fs.readFileSync(ulkaFile, "utf-8"),
      { $assets, ...values },
      ulkaFile
    )
  ).html
}

const parseUlka = async (
  ulkaTemplate: string,
  values = {},
  filePath = process.cwd()
) => {
  values = {
    ...values,
    $assets: (rPath: string) => $assets(rPath, filePath),
    globalInfo,
    $importUlka: (rPath: string) => $importUlka(rPath, values, filePath)
  }

  return {
    html: await parseUlkaWithPlugins(
      ulkaTemplate,
      values,
      {
        base: path.parse(filePath).dir,
        logError: false
      },
      { beforeUlkaParse, afterUlkaParse }
    )
  }
}

export default parseUlka
