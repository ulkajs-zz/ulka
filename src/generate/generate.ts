import { allFiles } from "../fs"
import MDSource from "../source/md"
import config from "../utils/data-utils/configs"
import absolutePath from "../utils/path-utils/absolute-path"
import {
  afterMdParse,
  afterUlkaParse,
  beforeMdParse,
  beforeUlkaParse
} from "../utils/data-utils/plugins"
import UlkaSource from "../source/ulka"
import globalInfo from "../globalInfo"

const { contents, pagesPath, templatesPath } = config
export default async function generate() {
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i]
    const mdFiles = allFiles(absolutePath(`src/${content.path}`), ".md")
    const tmpPath = absolutePath(`src/${templatesPath}/${content.template}`)

    const mdDatas: MDSource[] = []

    for (let j = 0; j < mdFiles.length; j++) {
      const file = mdFiles[j]
      const mdSource = new MDSource({
        fPath: file,
        plugins: {
          before: beforeMdParse,
          after: afterMdParse
        },
        contentInfo: { ...content, template: tmpPath }
      })
      await mdSource.transform()
      mdSource.calculate()
      mdDatas.push(mdSource)
    }

    const reqData = mdDatas.map(d => ({
      data: d.context.data,
      markdown: d.context.markdown,
      html: d.context.html,
      frontMatter: d.context.frontMatter,
      link: d.context.link,
      fPath: d.context.fPath,
      buildPath: d.context.buildFilePath
    }))

    globalInfo.contentFiles[content.path] = reqData

    for (let j = 0; j < mdDatas.length; j++) {
      const data = mdDatas[j]
      data.generate(reqData, j)
    }
  }

  const ulkaFiles = allFiles(absolutePath(`src/${pagesPath}`), ".ulka")

  for (let i = 0; i < ulkaFiles.length; i++) {
    const file = ulkaFiles[i]
    const ulkaSource = new UlkaSource({
      fPath: file,
      plugins: {
        before: beforeUlkaParse,
        after: afterUlkaParse
      }
    })

    await ulkaSource.generate()
  }
}
