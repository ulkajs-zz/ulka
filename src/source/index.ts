import { readFileSync } from "fs"
import { parse } from "ulka-parser"

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
      const fileData = readFileSync(this.context.fPath, "utf-8")
      this.context.data = parse(fileData, this.context.values)
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

  abstract async transform(): Promise<string>
  abstract generate(): void
}

export default Source
