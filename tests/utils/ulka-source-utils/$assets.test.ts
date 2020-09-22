import $assets from "../../../src/utils/ulka-source-utils/$assets"

describe("$assets function", () => {
  test("should return hashed name", () => {
    const fileName = $assets("src/test/path", "../index.js")
    expect(fileName.endsWith("index.js")).toBe(false)
  })
})
