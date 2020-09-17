import url from "url"
import { join, relative, parse } from "path"

import { mkdir } from "../../fs"
import globalInfo from "../../globalInfo"
import fromMd from "../transform-utils/from-md"
import absolutePath from "../path-utils/absolute-path"

const configs = globalInfo.configs

const buildDirectory = configs.buildPath
const tempDir = configs.templatesPath

const pathFromContentsDirectory = (contentsPath: string, path: string) => {
  return relative(join(process.cwd(), "src", contentsPath), path)
}

async function generateFromMd({ data, path, index }: any, contentInfo: any) {
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
    data = fromMd(path)
  }

  const template = join(process.cwd(), "src", tempDir, tempPath)

  data = await data

  const context = {
    data: data.html,
    frontMatter: data.frontMatter,
    link: "/" + link,
    buildFilePath,
    template
  }

  if (!contentInfo.contentFiles) contentInfo.contentFiles = {}

  contentInfo.contentFiles[path] = context

  if (!globalInfo.contentFiles[contentInfo.path] || index === 0)
    globalInfo.contentFiles[contentInfo.path] = []

  globalInfo.contentFiles[contentInfo.path].push(context)

  await mkdir(parse(buildFilePath).dir)

  // const html = await fromUlka(template, context)

  // writeFileSync(buildFilePath, html)

  return context
}

export default generateFromMd
