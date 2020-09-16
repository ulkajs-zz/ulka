import { allFiles } from "../fs"
import { configs } from "../utils/data-utils"
import { absolutePath } from "../utils/path-utils"
import { generateFromMd, generateFromUlka } from "../utils/generate-utils"

const pagesDirectory = absolutePath(`src/${configs.pagesPath}`)

export default async function generate() {
  const allUlkaFiles = allFiles(pagesDirectory, ".ulka")
  for (let i = 0; i < allUlkaFiles.length; i++) {
    const file = allUlkaFiles[i]
    try {
      await generateFromUlka(file)
    } catch (e) {
      console.log(`>> Error while generating ${file}`.red)
      throw e
    }
  }

  const contentsArr = configs.contents

  for (let i = 0; i < contentsArr.length; i++) {
    const content = contentsArr[i]

    const mdFiles = allFiles(absolutePath(`src/${content.path}`))

    for (let j = 0; j < mdFiles.length; j++) {
      const file = mdFiles[j]
      try {
        await generateFromMd(file, content)
      } catch (e) {
        console.log(`>> Error while generating ${file}`.red)
        throw e
      }
    }
  }
}
