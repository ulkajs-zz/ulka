import allFiles from "../fs/all-files"
import dataFromPath from "./dataFromPath"
import globalInfo from "../globalInfo"
import absolutePath from "./absolutePath"

function getData(filePath: string, ext: string) {
  const allData = allFiles(filePath, ext).map(dataFromPath)

  return allData
}

const mdDatas: { data: string; path: string }[][] = []

globalInfo.configs.contents.forEach((content: any) => {
  const mdData = getData(absolutePath(`src/${content.path}`), ".md")
  mdDatas.push(mdData)
})

const ulkaDatas = getData(
  absolutePath(`src/${globalInfo.configs.pagesPath}`),
  ".ulka"
)

export { ulkaDatas as ulka, mdDatas as md }
