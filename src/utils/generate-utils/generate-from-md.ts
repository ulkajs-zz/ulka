import { writeFileSync } from "fs"
import { join, relative, parse } from "path"
import { mkdir } from "../../fs"
import { configs } from "../data-utils"
import { fromMd, fromUlka } from "../transform-utils"

const buildDirectory = configs.buildPath

const pathFromContentsDirectory = (contentsPath: string, fPath: string) => {
  return relative(join(process.cwd(), "src", contentsPath), fPath)
}

async function generateFromMd(fPath: string, contentInfo: any) {
  const {
    template: tempPath,
    generatePath: genPath,
    path: contentsPath
  } = contentInfo

  const filePathFromContentsDir = pathFromContentsDirectory(contentsPath, fPath)

  const parsedFilePath = parse(filePathFromContentsDir)

  let buildFilePath = join(
    process.cwd(),
    buildDirectory,
    genPath,
    parsedFilePath.dir
  )

  if (parsedFilePath.name !== "index") {
    buildFilePath = join(buildFilePath, parsedFilePath.name, "index.html")
  } else {
    buildFilePath = join(buildFilePath, "index.html")
  }

  const { html: data, frontMatter } = await fromMd(fPath)
  const html = await fromUlka(tempPath, { data, frontMatter })

  await mkdir(parse(buildFilePath).dir)

  writeFileSync(buildFilePath, html)
}

export default generateFromMd
