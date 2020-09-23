import { readFileSync } from "fs"

export interface SourceContext {
  fPath: string
  data?: string | Promise<string>
  [key: string]: any
}

abstract class Source<T extends SourceContext> {
  constructor(public context: T) {}

  get data(): string | Promise<string> {
    if (!this.context.data) {
      this.context.data = readFileSync(this.context.fPath, "utf-8")
    }
    return this.context.data
  }

  abstract async transform(): Promise<any>
  abstract generate(...args: any): Promise<any>
}

export default Source
