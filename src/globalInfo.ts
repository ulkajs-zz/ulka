import configs from "./data/configs"

interface globalInfoType {
  contentFiles: {
    [key: string]: any
  }
  configs: any
  status: string
  [key: string]: any
}

const globalInfo: globalInfoType = {
  contentFiles: {},
  configs,
  status: "building"
}

export default globalInfo
