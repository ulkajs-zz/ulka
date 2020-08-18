import configs from './parse/parseConfig'

interface globalInfoType {
  contentFiles: any[]
  pagesFiles: any[]
  configs: any
}

const globalInfo: globalInfoType = {
  contentFiles: [],
  pagesFiles: [],
  configs
}

export default globalInfo
