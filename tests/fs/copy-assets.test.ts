import path from "path"
import { allFiles, copyAssets, rmdir } from "../../src/fs"
import absolutePath from "../../src/utils/absolute-path"

const testDir = "tests/resources/fs_test/copyassets"

describe("copy assets function", () => {
  test("should copy assets from `testDir/from` to `testDir/to` except the ones having .ulka.(ext) at the end", async () => {
    rmdir(absolutePath(`${testDir}/to`))

    await copyAssets(absolutePath(`${testDir}/from`), `${testDir}/to`)

    const files = allFiles(absolutePath(`${testDir}/to`)).map(file =>
      path.relative(process.cwd(), file).split(path.sep)
    )

    expect(files).toMatchInlineSnapshot(`
      Array [
        Array [
          "tests",
          "resources",
          "fs_test",
          "copyassets",
          "to",
          "__assets__",
          "b940ba58aee6f6df41bc11b5806fa1.css",
        ],
      ]
    `)
  })
})
