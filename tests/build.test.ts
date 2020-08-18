import "colors"
import fs from "fs"
import absolutePath from "../src/utils/absolutePath"
import globalInfo from "../src/globalInfo"

import build from "../src/bin/build"

const curDir = process.cwd()

describe("build function: ", () => {
  beforeEach(() => {
    process.chdir(absolutePath("tests/resources/ulka_test"))
  })

  afterEach(() => {
    process.chdir(curDir)
  })

  test("globalInfo should have info about content files", async () => {
    await build()
    const contentFiles = globalInfo.contentFiles.map(f => {
      delete f.createFilePath
      delete f.link
      delete f.absoluteFilePath
      return f
    })

    expect(contentFiles).toMatchSnapshot()
  })

  test("bulid folder should be created", () => {
    const buildExists = fs.existsSync(globalInfo.configs.buildPath)
    expect(buildExists).toBe(true)
  })
})
