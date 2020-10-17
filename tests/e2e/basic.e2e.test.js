const fs = require("fs")
const path = require("path")
const cheerio = require("cheerio")
const build = require("../../src/ulka-cli/build")
const { createInfo } = require("../../src/utils/build-utils")

beforeAll(async () => {
  const cwd = path.join(__dirname, "resources", "basic")
  const info = createInfo(cwd, "build")

  await build(info)
})

describe("pages - index.html", () => {
  let $
  beforeAll(() => {
    const html = fs.readFileSync(
      path.join(__dirname, "resources", "basic", "build", "index.html")
    )
    $ = cheerio.load(html)
  })

  test("should have proper title", () => {
    expect($("title").text()).toBe("BASIC PROJECT")
  })

  test("links should have all link with expected href", () => {
    const links = []
    $(".links > a").each((_, el) => {
      links.push($(el).attr("href"))
    })

    expect(links).toEqual(["/post-1/", "/post-2/"])
  })
})

describe("contents - post-1/index.html", () => {
  let $
  beforeAll(() => {
    const html = fs.readFileSync(
      path.join(
        __dirname,
        "resources",
        "basic",
        "build",
        "post-1",
        "index.html"
      )
    )

    $ = cheerio.load(html)
  })

  test("should have title equal to the frontmatter.title", () => {
    expect($("title").text()).toBe("This is post 1")
  })

  test("#current-link should have link to that page", () => {
    expect($("#current-link").attr("href")).toBe("/post-1/")
  })

  test("should have the heading from template file", () => {
    expect($("#template-heading").text()).toBe("This is from template")
  })

  test("local image link should be hashed", () => {
    expect($("img").attr("src")).not.toBe("/link/to/image.jpg")
  })

  test("url link in image shouldn't be hashed", () => {
    $("img").each((_, el) => {
      expect($(el).attr("src")).toBe("https://something.com/image.png")
    })
  })
})
