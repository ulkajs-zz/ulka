import globalInfo from "./globalInfo"
import rmDir from "./fs/rmdir"
import mkdir from "./fs/mkdir"
import allFiles from "./fs/allFiles"
import dataFromPath from "./utils/dataFromPath"
import generateName from "./utils/generateName"
import parseUlkaWithPlugins from "./utils/parseUlkaWithPlugins"
import parseMarkdownWithPlugins from "./utils/parseMdWithPlugins"
import absolutePath from "./utils/absolutePath"

const exportObject: any = {
  globalInfo,
  fs: {
    rmDir,
    mkdir,
    allFiles
  },
  utils: {
    dataFromPath,
    generateName,
    absolutePath
  },
  parseWithPlugins: {
    parseUlkaWithPlugins,
    parseMarkdownWithPlugins
  }
}

export default exportObject
