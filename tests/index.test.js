test("Should exported the expected value", () => {
  expect(require("../src/index")).toMatchInlineSnapshot(`
    Object {
      "generateHash": [Function],
      "getConfigs": [Function],
      "log": Object {
        "error": [Function],
        "info": [Function],
        "normal": [Function],
        "success": [Function],
        "warning": [Function],
      },
    }
  `)
})
