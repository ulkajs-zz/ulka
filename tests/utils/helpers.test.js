const { absolutePath } = require("../../src/utils/helpers")
const path = require("path")

describe("Absolute path function", () => {
  test("Should return the absolute path", () => {
    const absPath = path
      .relative(process.cwd(), absolutePath("/src/utils/helpers.js"))
      .split(path.sep)
      .join("/")

    expect(absPath).toBe("src/utils/helpers.js")
  })

  test("Should return current working directory in provded empty string", () => {
    const absPath = absolutePath("")

    expect(absPath).toBe(process.cwd())
  })

  test("Should throw an error if arg is not string", () => {
    expect(absolutePath).toThrow("Path provided should be string")
  })
})
