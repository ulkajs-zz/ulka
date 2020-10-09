const {
  absolutePath,
  generateHash,
  getConfigs
} = require("../../src/utils/helpers")
const path = require("path")

const cwd = process.cwd()
const configsTestDir = absolutePath("tests/utils/resources")

describe("Absolute path function", () => {
  test("Should return the absolute path", () => {
    const absPath = path
      .relative(cwd, absolutePath("/src/utils/helpers.js"))
      .split(path.sep)
      .join("/")

    expect(absPath).toBe("src/utils/helpers.js")
  })

  test("Should return current working directory in provded empty string", () => {
    const absPath = absolutePath("")

    expect(absPath).toBe(cwd)
  })

  test("Should throw an error if arg is not string", () => {
    expect(absolutePath).toThrow("Path provided should be string")
  })
})

describe("generateHash function", () => {
  test("should return hash from a string", () => {
    expect(generateHash("strongword")).not.toBe("strongword")
  })

  test("should return hash for empty string if noting provided", () => {
    expect(generateHash()).not.toBe("")
  })
})

describe("getConfigs function", () => {
  test("should return default configs", () => {
    expect(getConfigs(cwd)).toEqual({
      buildPath: path.join(cwd, "build"),
      pagesPath: path.join(cwd, "pages"),
      templatesPath: path.join(cwd, "templates"),
      contents: [],
      plugins: []
    })
  })

  test("should return the configs in ulka-config.js", () => {
    expect(getConfigs(configsTestDir)).toEqual({
      buildPath: path.join(configsTestDir, "build"),
      pagesPath: path.join(configsTestDir, "pages"),
      templatesPath: path.join(configsTestDir, "templates"),
      contents: [
        {
          path: path.join(configsTestDir, "contents")
        }
      ],
      plugins: ["ulka-plugin-sitemap"]
    })
  })
})
