const log = require("../../src/utils/ulka-log")

describe("Log Object", () => {
  test("should have all the functions", () => {
    expect(Object.keys(log)).toEqual([
      "normal",
      "warning",
      "error",
      "success",
      "info"
    ])
  })

  test("Should log message on apporiate color", () => {
    const spy = jest.spyOn(console, "log")

    log.normal("Hello World")
    log.error("Hello World")
    log.info("Hello World")
    log.success("Hello World")
    log.warning("Hello World")

    log.error("Hello World", true)
    log.info("Hello World", true)
    log.success("Hello World", true)
    log.warning("Hello World", true)

    expect(spy.mock.calls).toEqual([
      ["\u001b[1m>> \u001b[22m", "Hello World"],
      ["\u001b[1m\u001b[31m>> \u001b[39m\u001b[22m", "Hello World"],
      ["\u001b[1m\u001b[34m>> \u001b[39m\u001b[22m", "Hello World"],
      ["\u001b[1m\u001b[32m>> \u001b[39m\u001b[22m", "Hello World"],
      ["\u001b[1m\u001b[33m>> \u001b[39m\u001b[22m", "Hello World"],
      [
        "\u001b[1m\u001b[31m>> \u001b[39m\u001b[22m",
        "\u001b[31mHello World\u001b[39m"
      ],
      [
        "\u001b[1m\u001b[34m>> \u001b[39m\u001b[22m",
        "\u001b[34mHello World\u001b[39m"
      ],
      [
        "\u001b[1m\u001b[32m>> \u001b[39m\u001b[22m",
        "\u001b[32mHello World\u001b[39m"
      ],
      [
        "\u001b[1m\u001b[33m>> \u001b[39m\u001b[22m",
        "\u001b[33mHello World\u001b[39m"
      ]
    ])
    spy.mockRestore()
  })
})
