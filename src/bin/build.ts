import path from "path"
import globalInfo from "../globalInfo"
import copyAssets from "../fs/copyAssets"
import removeDirectories from "../fs/rmdir"
import generateFromMd from "../generate/generateMd"
import generateFromUlka from "../generate/generateUlka"

async function build() {
  globalInfo.contentFiles = []
  try {
    console.log(">> Copying assets".green)
    await copyAssets(
      path.join(process.cwd(), "src"),
      globalInfo.configs.buildPath
    )
    console.log(">> Generating from markdown files".green)

    const contentsIsArray = Array.isArray(globalInfo.configs.contents)

    if (contentsIsArray) {
      for (let i = 0; i < globalInfo.configs.contents.length; i++) {
        const contentsDir = globalInfo.configs.contents[i]
        await generateFromMd(contentsDir, i)
      }
    } else {
      await generateFromMd(globalInfo.configs.contents)
    }

    console.log(">> Generating from ulka files".green)
    await generateFromUlka()
  } catch (e) {
    console.log(`>> ${e.toString()}\n`.red)

    if (e.name !== "ReferenceError") console.log(e)

    console.log(">> Build Failed".red)
    console.log(`>> Removing ${globalInfo.configs.buildPath} folder`.red)
    await removeDirectories(globalInfo.configs.buildPath)
    process.exit(0)
  }
}

export default build
