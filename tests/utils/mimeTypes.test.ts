import mimeType from "../../src/utils/mimeTypes"

describe("mimeType", () => {
  test("should return mimetype object", () => {
    expect(mimeType).toMatchSnapshot()
  })
})
