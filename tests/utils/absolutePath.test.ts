import path from "path"
import absolutePath from "../../src/utils/absolutePath"

describe("AbsolutePath function", () => {
  describe("on given path/to/file", () => {
    test("should return a absolute path", () => {
      expect(absolutePath("path/to/file")).toBe(
        path.join(process.cwd(), ..."path/to/file".split("/"))
      )
    })
  })

  describe("on given empty string", () => {
    test("should retrun cwd", () => {
      expect(absolutePath("")).toBe(process.cwd())
    })
  })

  describe("on given other than string", () => {
    test("should throw error", () => {
      expect(absolutePath).toThrow("Path provided should be string")
      // @ts-ignore
      expect(() => absolutePath(1)).toThrow("Path provided should be string")
    })
  })
})
