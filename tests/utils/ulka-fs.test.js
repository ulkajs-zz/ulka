const path = require("path")
const { allFiles } = require("../../src/utils/ulka-fs")

const allFilesTestDir = path.join(__dirname, "resources", "test-all-files")

describe("ULka file system", () => {
  describe("all files function", () => {
    test("should return the list of all files on ext-.js", () => {
      const files = allFiles(allFilesTestDir).map(file =>
        path.relative(__dirname, file).split(path.sep).join("/")
      )

      expect(files).toMatchInlineSnapshot(`
        Array [
          "resources/test-all-files/1-dir/1-1-dir/1-1.js",
          "resources/test-all-files/1-dir/1-1-dir/1-1.json",
          "resources/test-all-files/1-dir/1.js",
          "resources/test-all-files/1-dir/1.json",
          "resources/test-all-files/2-dir/2.js",
          "resources/test-all-files/2-dir/2.json",
        ]
      `)
    })

    test("should return the list of all .js files on ext=.js", () => {
      const files = allFiles(allFilesTestDir, ".js").map(file =>
        path.relative(__dirname, file).split(path.sep).join("/")
      )

      expect(files).toMatchInlineSnapshot(`
        Array [
          "resources/test-all-files/1-dir/1-1-dir/1-1.js",
          "resources/test-all-files/1-dir/1.js",
          "resources/test-all-files/2-dir/2.js",
        ]
      `)
    })

    test("should return filePath in a string of path to file is provided", () => {
      const files = allFiles(
        path.join(allFilesTestDir, "1-dir", "1.js")
      ).map(file => path.relative(__dirname, file).split(path.sep).join("/"))

      expect(files).toMatchInlineSnapshot(`
        Array [
          "resources/test-all-files/1-dir/1.js",
        ]
      `)
    })
  })

  // test("should create directory", () => {
  //   mkdir(path.join(process.cwd(), "tests", "test-dir", "new-created-folder"))
  // })
})
