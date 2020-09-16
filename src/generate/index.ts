import { allFiles } from "../fs"
import { configs } from "../utils/data-utils"
import { absolutePath } from "../utils/path-utils"
import { generateFromMd, generateFromUlka } from "../utils/generate-utils"
import { fromMd, fromUlka } from "../utils/transform-utils"

const pagesDirectory = absolutePath(`src/${configs.pagesPath}`)

export default async function generate() {
  const contentsArr = configs.contents
  for (let i = 0; i < contentsArr.length; i++) {
    const content = contentsArr[i]

    const mdFiles = allFiles(absolutePath(`src/${content.path}`)).map(file => ({
      path: file,
      data: fromMd(file)
    }))

    for (let j = 0; j < mdFiles.length; j++) {
      const file = mdFiles[j]
      try {
        await generateFromMd(file, content)
      } catch (e) {
        console.log(`>> Error while generating ${file.path}`.red)
        throw e
      }
    }
  }

  const allUlkaFiles = allFiles(pagesDirectory, ".ulka").map(file => ({
    data: fromUlka(file, {}),
    path: file
  }))

  for (let i = 0; i < allUlkaFiles.length; i++) {
    const file = allUlkaFiles[i]
    try {
      await generateFromUlka(file)
    } catch (e) {
      console.log(`>> Error while generating ${file}`.red)
      throw e
    }
  }
}
