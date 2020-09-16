import { writeFileSync } from "fs"
import { relative, join, parse } from "path"

import { mkdir } from "../../fs"
import { configs } from "../data-utils"
import { fromUlka } from "../transform-utils"

const pagesDirectory = configs.pagesPath
const buildDirectory = configs.buildPath

const pathFromPagesDirectory = (fPath: string) => {
  return relative(join(process.cwd(), "src", pagesDirectory), fPath)
}

export default async function generateFromUlka(fPath: string) {
  const filePathFromPagesDirectory = pathFromPagesDirectory(fPath)

  const parsedFilePath = parse(filePathFromPagesDirectory)

  let buildFilePath = join(process.cwd(), buildDirectory, parsedFilePath.dir)

  if (parsedFilePath.name !== "index") {
    buildFilePath = join(buildFilePath, parsedFilePath.name, "index.html")
  } else {
    buildFilePath = join(buildFilePath, "index.html")
  }

  const data = await fromUlka(fPath, {})

  await mkdir(parse(buildFilePath).dir)

  writeFileSync(buildFilePath, data)
}
