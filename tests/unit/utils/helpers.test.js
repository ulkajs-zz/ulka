const helpers = require("../../../src/utils/helpers")
const path = require("path")
const { spinner } = require("../../../src/utils/helpers")

const cwd = process.cwd()

const { absolutePath, generateHash, getConfigs } = helpers

describe("Should export the expected helpers function", () => {
  expect(helpers).toMatchInlineSnapshot(`
    Object {
      "absolutePath": [Function],
      "copyAssets": [Function],
      "generateHash": [Function],
      "getConfigs": [Function],
      "spinner": [Function],
    }
  `)
})

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
  const configs = getConfigs(path.join(__dirname, "resources"))
  test("should return configs with expected keys", () => {
    expect(Object.keys(configs)).toEqual([
      "buildPath",
      "pagesPath",
      "templatesPath",
      "contents",
      "plugins"
    ])
  })

  test("Should have the plugin mentioned in ulka-config.js", () => {
    const spy = jest.spyOn(console, "log")

    configs.plugins.beforeBuild[0]()

    expect(spy.mock.calls).toEqual([["Hi"]])
    spy.mockRestore()
  })

  test("Should return the configs with absolute path", () => {
    const isAbs = path.isAbsolute
    const truthyArray = [
      isAbs(configs.buildPath),
      isAbs(configs.templatesPath),
      isAbs(configs.pagesPath),
      isAbs(configs.contents[0].path),
      isAbs(configs.contents[0].template)
    ]

    expect(truthyArray.filter(el => el !== false).length).toBe(5)
  })

  test("Should exit with status 0 if config not found", () => {
    const spy = jest.spyOn(process, "exit").mockImplementation(() => {})
    getConfigs(__dirname)
    expect(spy).toHaveBeenCalledWith(0)
    spy.mockRestore()
  })

  test("Should exit on invalid plugin", () => {
    const spy = jest.spyOn(process, "exit").mockImplementation(() => {})

    getConfigs(path.join(__dirname, "resources", "invalid-plugins"))

    expect(spy).toHaveBeenCalledWith(0)
    spy.mockRestore()
  })

  test("Should exit if plugin not found", () => {
    const spy = jest.spyOn(process, "exit").mockImplementation(() => {})

    getConfigs(path.join(__dirname, "resources", "plugin-not-found"))

    expect(spy).toHaveBeenCalledWith(0)
    spy.mockRestore()
  })
})

describe("spinner function", () => {
  test("should be called after 1s of calling it", done => {
    const stop = spinner()
    const spy = jest.spyOn(process.stdout, "write")
    setTimeout(() => {
      stop()
      expect(spy.mock.calls[0].length).toEqual(1)
      spy.mockRestore()
      done()
    }, 100)
  })
})
