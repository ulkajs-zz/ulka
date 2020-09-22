import $assets from "../../../src/utils/ulka-source-utils/$assets"

describe("$assets function", () => {
  test("should have", () => {
    const fileName = $assets("src/test/path", "../index.js")
    expect(fileName).toMatchInlineSnapshot(
      `"/__assets__/5033de5a2eccc46b3b728f15902592"`
    )
  })
})
