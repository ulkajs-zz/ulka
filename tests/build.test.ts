import path from "path"

const curDir = process.cwd()

describe("Build function", () => {
  beforeEach(async () => {
    process.chdir(path.join(curDir, "tests", "resources", "ulka_test"))
  })

  afterEach(() => {
    process.chdir(curDir)
  })

  test("globalInfo should have the content data after building", async () => {
    await require("../src/bin/build").default()
    const contentFiles = require("../src/globalInfo").default.contentFiles.contents.map(
      (c: any) => ({
        link: c.link,
        frontMatter: c.frontMatter,
        fields: c.fields,
        data: c.data
      })
    )
    expect(contentFiles).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": "<h1>This is post one</h1>",
          "fields": Object {},
          "frontMatter": Object {
            "title": "Post 1",
          },
          "link": "/blog/post-1/",
        },
        Object {
          "data": "<h1>Post 2</h1>",
          "fields": Object {},
          "frontMatter": Object {
            "title": "Post 2",
          },
          "link": "/blog/post-2/",
        },
      ]
    `)
  })
})
