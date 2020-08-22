import parseMd from "../../src/parse/parseMd"

describe("on given markdown", () => {
  test("should return proper html", async () => {
    const markdown = `# Hello World`
    const parsedMarkdown = await parseMd(markdown)
    expect(parsedMarkdown.html).toBe("<h1>Hello World</h1>")
  })

  test("should return proper frontMatter", async () => {
    const markdown = `---\ntitle: "Roshan Acharya"\n---`
    const parsedMarkdown = await parseMd(markdown)
    expect(parsedMarkdown.frontMatter.title).toBe("Roshan Acharya")
  })
})

describe("Using ulka syntax inside markdown", () => {
  test("on given {% globalInfo.configs.buildPath %} should return <p>build</p>", async () => {
    const markdown = `{% globalInfo.configs.buildPath %}`
    const parsedMarkdown = await parseMd(markdown)
    expect(parsedMarkdown.html).toBe("<p>build</p>")
  })

  test("on given # {% 2 + 3 %} should return <h1>5</h1>", async () => {
    const markdown = `# {% 2 + 3 %}`
    const parsedMarkdown = await parseMd(markdown)
    expect(parsedMarkdown.html).toBe("<h1>5</h1>")
  })
})
