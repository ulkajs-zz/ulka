import configs from "./utils/data-utils/configs"
import fromMd from "./utils/transform-utils/from-md"
import fromUlka from "./utils/transform-utils/from-ulka"

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
  status: "building",
  getHTML: {
    fromMd: (data: string) => fromMd("", data),
    fromUlka: (data: string, values: any) => fromUlka("", values, data)
  }
}

export default globalInfo
