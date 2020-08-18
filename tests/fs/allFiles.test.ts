import path from "path"
import allFiles from "../../src/fs/allFiles"
import absolutePath from "../../src/utils/absolutePath"

describe("all Files function", () => {
  test("should return all files in a folder", () => {
    const allFilesList = allFiles(
      absolutePath("tests/resources/fs_allfiles_test")
    ).map(f => path.relative(process.cwd(), f).split(path.sep).join("/"))
    expect(allFilesList).toMatchSnapshot()
  })

  test("should return ulka files only", () => {
    const allUlkaFiles = allFiles(
      absolutePath("tests/resources/fs_allfiles_test"),
      ".ulka"
    ).map(f => path.relative(process.cwd(), f).split(path.sep).join("/"))
    expect(allUlkaFiles).toMatchSnapshot()
  })

  test("should return js files only", () => {
    const allJsFiles = allFiles(
      absolutePath("tests/resources/fs_allfiles_test"),
      ".js"
    ).map(f => path.relative(process.cwd(), f).split(path.sep).join("/"))
    expect(allJsFiles).toMatchSnapshot()
  })
})
