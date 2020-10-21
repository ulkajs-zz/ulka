test("Should exported the expected value", () => {
  expect(require("../../src/index")).toMatchInlineSnapshot(`
    Object {
      "createBuildPath": [Function],
      "generateHash": [Function],
      "getConfigs": [Function],
      "getLink": [Function],
      "log": Object {
        "error": [Function],
        "info": [Function],
        "normal": [Function],
        "success": [Function],
        "warning": [Function],
      },
      "ulkaFs": Object {
        "allFiles": [Function],
        "mkdir": [Function],
        "rmdir": [Function],
      },
    }
  `)
})
