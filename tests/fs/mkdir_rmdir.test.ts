import fs from "fs"
import { mkdir, rmdir } from "../../src/fs"
import absolutePath from "../../src/utils/absolute-path"

const folderPath = "tests/resources/fs_test/mkdir_rmdir/created_folder"

describe("add and remove directories", () => {
  test("should add directory", async () => {
    await mkdir(absolutePath(`${folderPath}/oho`))
    fs.writeFileSync(
      absolutePath(`${folderPath}/oho/hello.html`),
      "hello world"
    )
    const folderIsCreated = fs.existsSync(absolutePath(folderPath + "/oho"))
    expect(folderIsCreated).toBe(true)
  })

  test("should remove the created directory", () => {
    rmdir(folderPath)
    const folderStillExists = fs.existsSync(folderPath)
    expect(folderStillExists).toBe(false)
  })
})
