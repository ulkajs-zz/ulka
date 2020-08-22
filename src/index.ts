import rmDir from "./fs/rmdir"
import mkdir from "./fs/mkdir"
import allFiles from "./fs/allFiles"
import dataFromPath from "./utils/dataFromPath"
import generateName from "./utils/generateName"
import parseUlkaWithPlugins from "./utils/parseUlkaWithPlugins"
import parseMarkdownWithPlugins from "./utils/parseMdWithPlugins"
import absolutePath from "./utils/absolutePath"

export * as globalInfo from "./globalInfo"
export const fs = {
  rmDir,
  mkdir,
  allFiles
}

export const utils = {
  dataFromPath,
  generateName,
  absolutePath
}

export const parseWithPlugins = {
  parseUlkaWithPlugins,
  parseMarkdownWithPlugins
}
