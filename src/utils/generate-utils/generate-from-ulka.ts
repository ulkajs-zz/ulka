delete require.cache[require.resolve("../transform-utils/from-ulka")]
delete require.cache[require.resolve("../../globalInfo")]

import { writeFileSync } from "fs"
import { relative, join, parse } from "path"

import { mkdir } from "../../fs"
import globalInfo from "../../globalInfo"
import fromUlka from "../transform-utils/from-ulka"

const configs = globalInfo.configs

const pagesDirectory = configs.pagesPath
const buildDirectory = configs.buildPath

const pathFromPagesDirectory = (path: string) => {
  return relative(join(process.cwd(), "src", pagesDirectory), path)
}

const generateFromUlka = async ({ data, path }: any) => {
  const filePathFromPagesDirectory = pathFromPagesDirectory(path)

  const parsedFilePath = parse(filePathFromPagesDirectory)

  let buildFilePath = join(process.cwd(), buildDirectory, parsedFilePath.dir)

  if (parsedFilePath.name !== "index") {
    buildFilePath = join(buildFilePath, parsedFilePath.name, "index.html")
  } else {
    buildFilePath = join(buildFilePath, "index.html")
  }

  if (!data) {
    data = fromUlka(path, {})
  }

  await mkdir(parse(buildFilePath).dir)

  const html = await data
  writeFileSync(buildFilePath, html)
}

export default generateFromUlka
