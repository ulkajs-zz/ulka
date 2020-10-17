const fs = require("fs")
const path = require("path")
const cheerio = require("cheerio")

const build = require("../../src/ulka-cli/build")
const { createInfo } = require("../../src/utils/build-utils")

beforeAll(async () => {
  const cwd = path.join(__dirname, "resources", "with-plugin")
  const info = createInfo(cwd, "build")

  await build(info)
})

describe("page index.html", () => {
  let $
  beforeAll(() => {
    const html = fs.readFileSync(
      path.join(__dirname, "resources", "with-plugin", "build", "index.html")
    )
    $ = cheerio.load(html)
  })
  test("Should render value added by beforeContentRender plugin", () => {
    expect($(".reading-time").first().text()).toBe("1min")
  })

  test("Should render value added by beforePageRender plugin", () => {
    expect($("#my-name").text()).toBe("Roshan Acharya")
  })
})

describe("content post-1/index.html", () => {
  let $ = cheerio.load("")
  beforeAll(() => {
    const html = fs.readFileSync(
      path.join(
        __dirname,
        "resources",
        "with-plugin",
        "build",
        "post-1",
        "index.html"
      )
    )
    $ = cheerio.load(html)
  })

  test("should render value added by beforeContentRender plugin", () => {
    expect($("#reading-time").text()).toBe("1min")
  })
})
