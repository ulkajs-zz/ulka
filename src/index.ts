import rmDir from "./fs/rmdir"
import mkdir from "./fs/mkdir"
import allFiles from "./fs/all-files"
import dataFromPath from "./utils/dataFromPath"
import generateName from "./utils/generateName"
import parseUlkaWithPlugins from "./utils/parseUlkaWithPlugins"
import parseMarkdownWithPlugins from "./utils/parseMdWithPlugins"

export * as globalInfo from "./globalInfo"
export const fs = {
  rmDir,
  mkdir,
  allFiles
}

export const utils = {
  dataFromPath,
  generateName
}

export const parseWithPlugins = {
  parseUlkaWithPlugins,
  parseMarkdownWithPlugins
}
