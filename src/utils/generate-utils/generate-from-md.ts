import url from "url"
import { writeFileSync } from "fs"
import { join, relative, parse } from "path"
import { mkdir } from "../../fs"
import { configs } from "../data-utils"
import { fromMd, fromUlka } from "../transform-utils"
import { absolutePath } from "../path-utils"

const buildDirectory = configs.buildPath
const tempDir = configs.templatesPath

const pathFromContentsDirectory = (contentsPath: string, path: string) => {
  return relative(join(process.cwd(), "src", contentsPath), path)
}

async function generateFromMd({ data, path }: any, contentInfo: any) {
  const {
    template: tempPath,
    generatePath: genPath,
    path: contentsPath
  } = contentInfo

  const filePathFromContentsDir = pathFromContentsDirectory(contentsPath, path)

  const { name, dir } = parse(filePathFromContentsDir)

  let buildFilePath = absolutePath(`${buildDirectory}/${genPath}/${dir}`)

  if (name !== "index") {
    buildFilePath = join(buildFilePath, name, "index.html")
  } else {
    buildFilePath = join(buildFilePath, "index.html")
  }

  const link = url.format(relative(absolutePath(buildDirectory), buildFilePath))

  if (!data) {
    data = await fromMd(path)
  }

  const template = join(process.cwd(), tempDir, tempPath)

  const context = {
    data: data.html,
    frontMatter: data.frontMatter,
    link: "/" + link
  }

  const html = await fromUlka(template, context)

  if (!contentInfo.contentFiles) contentInfo.contentFiles = {}

  contentInfo.contentFiles[path] = context

  await mkdir(parse(buildFilePath).dir)

  writeFileSync(buildFilePath, html)
}

export default generateFromMd
