import path from "path"
import { allFiles } from "../../src/fs"
import absolutePath from "../../src/utils/absolute-path"

const testDir = "tests/resources/fs_test/allfiles"

describe("all Files function", () => {
  test("should return all files in a folder", () => {
    const allFilesList = allFiles(absolutePath(testDir)).map(f =>
      path.relative(process.cwd(), f).split(path.sep).join("/")
    )
    expect(allFilesList).toMatchSnapshot()
  })

  test("should return ulka files only", () => {
    const allUlkaFiles = allFiles(absolutePath(testDir), ".ulka").map(f =>
      path.relative(process.cwd(), f).split(path.sep).join("/")
    )
    expect(allUlkaFiles).toMatchSnapshot()
  })

  test("should return js files only", () => {
    const allJsFiles = allFiles(absolutePath(testDir), ".js").map(f =>
      path.relative(process.cwd(), f).split(path.sep).join("/")
    )
    expect(allJsFiles).toMatchSnapshot()
  })
})
