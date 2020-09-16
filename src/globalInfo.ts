import { configs } from "./utils/data-utils"

interface globalInfoType {
  contentFiles: {
    [key: string]: any
  }
  configs: any
  status: string
}

const globalInfo: globalInfoType = {
  contentFiles: [],
  configs,
  status: "serving"
}

export default globalInfo
