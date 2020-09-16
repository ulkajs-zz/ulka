import { writeFileSync } from "fs"
import { isAbsolute, relative, join, parse } from "path"

import { mkdir } from "../fs"
import { fromUlka } from "../utils/build-utils"
import { configs } from "../utils/data-utils"
import { absolutePath } from "../utils/path-utils"

const pagesDirectory = configs.pagesPath
const buildDirectory = configs.buildPath

const pathFromPagesDirectory = (fPath: string) => {
  return relative(join(process.cwd(), "src", pagesDirectory), fPath)
}

export function generate(fPath: string) {
  fPath = isAbsolute(fPath) ? fPath : absolutePath(fPath)

  return fPath
}

export async function generateFromMarkdown(fPath: string) {
  return fPath
}

export async function generateFromUlka(fPath: string) {
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
