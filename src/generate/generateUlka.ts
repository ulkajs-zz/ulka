import fs from "fs"
import path from "path"

import mkdir from "../fs/mkdir"
import globalInfo from "../globalInfo"
import parseUlka from "../parse/parseUlka"
import absolutePath from "../utils/absolutePath"
import data from "./data"

const configs = globalInfo.configs

async function generateFromUlka() {
  const pagesData = data(
    absolutePath(`src/${configs.pagesPath}`),
    ".ulka",
    { ...configs },
    parseUlka
  )

  for (let i = 0; i < pagesData.length; i++) {
    const ufd = pagesData[i]

    try {
      await buildFromUlka(ufd)
    } catch (e) {
      console.log(`>> Error while generating ${ufd.path}`.red)
      throw e
    }
  }
}

async function buildFromUlka(ufd: any) {
  // Get filepath relative to pagespath
  // eg: \index.ulka or folder\file.ulka

  const filePath = path.relative(
    path.join("src", configs.pagesPath),
    ufd.relativePath
  )

  // Prase filepath
  const parsedPath = path.parse(filePath)

  // filePath to create .html files eg: build\folder
  let createFilePath = configs.buildPath + parsedPath.dir

  // The goal here is to generate dir/index.ulka to dir/index.html
  // and dir/hehe.ulka to dir/hehe/index.html
  if (parsedPath.name !== "index") {
    createFilePath += "/" + parsedPath.name
    parsedPath.name = "index"
  }

  // Absolute Filepath to create html files
  const absoluteFilePath = absolutePath(
    `${createFilePath}/${parsedPath.name}.html`
  )

  // Prased html data
  const html = (await ufd.data).html

  // Create folder to generate html files
  await mkdir(createFilePath)

  globalInfo.pagesFiles.push({
    html,
    createFilePath,
    absoluteFilePath
  })

  // Create html files
  fs.writeFileSync(absoluteFilePath, html)
}

export default generateFromUlka
