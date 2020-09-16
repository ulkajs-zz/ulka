import path from "path"
import allFiles from "../fs/all-files"
import { dataFromPath } from "../utils/path-utils"

const data = (
  filePath: string,
  ext: string,
  values: any,
  parser: (raw: string, values: any, path?: string) => any
) => {
  try {
    const allData = allFiles(filePath, ext)
      .map(dataFromPath)
      .map((fileData: { data: string; path: string }) => ({
        ...fileData,
        data: parser(fileData.data, values, fileData.path),
        relativePath: path.relative(process.cwd(), fileData.path)
      }))

    return allData
  } catch (e) {
    console.log(`\n>> ${e.message}`.red)
    process.exit(0)
  }
}

export default data
