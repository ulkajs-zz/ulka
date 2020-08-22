import configs from "./parse/parseConfig"

interface globalInfoType {
  contentFiles: any[]
  pagesFiles: any[]
  configs: any
  status: string
}

const globalInfo: globalInfoType = {
  contentFiles: [],
  pagesFiles: [],
  configs,
  status: "serving"
}

export default globalInfo
