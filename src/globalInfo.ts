import { configs } from "./utils/data-utils"

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
