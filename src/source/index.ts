import { readFileSync } from "fs"

export interface SourceContext {
  fPath: string
  data?: string | Promise<string>
  plugins?: {
    before?: any[]
    after?: any[]
  }
  [key: string]: any
}

abstract class Source {
  constructor(public context: SourceContext) {}

  get data(): string | Promise<string> {
    if (!this.context.data) {
      this.context.data = readFileSync(this.context.fPath, "utf-8")
    }
    return this.context.data
  }

  get plugins() {
    if (!this.context.plugins) {
      this.context.plugins = {
        before: [],
        after: []
      }
    }

    return this.context.plugins
  }

  abstract async transform(): Promise<any>
  abstract generate(...args: any): Promise<any>
}

export default Source
