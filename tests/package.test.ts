import packageJson from "../package.json"

describe("Package.json file", () => {
  test("should have name as ulka", () => {
    expect(packageJson.name).toBe("ulka")
  })

  test("should have main as './dist/index.js'", () => {
    expect(packageJson.main).toBe("./dist/index.js")
  })

  test('should have types as "./dist/index.d.ts"', () => {
    expect(packageJson.types).toBe("./dist/index.d.ts")
  })

  test("should have bin.ulka as './dist/bin/index.js'", () => {
    expect(packageJson.bin.ulka).toBe("./dist/bin/index.js")
  })

  test("should have expected dependencies", () => {
    expect(Object.keys(packageJson.dependencies)).toEqual([
      "better-opn",
      "chokidar",
      "colors",
      "commander",
      "gray-matter",
      "hast-util-raw",
      "portfinder",
      "rehype-stringify",
      "remark-parse",
      "remark-rehype",
      "ulka-parser",
      "unified",
      "ws"
    ])
  })

  test("should have expected scripts", () => {
    expect(Object.keys(packageJson.scripts)).toEqual([
      "test",
      "build",
      "eslint",
      "eslint:fix",
      "prettier",
      "prettier:write",
      "lint-staged",
      "prepublishOnly"
    ])
  })
})
