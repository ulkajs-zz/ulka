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
          "data": "<h1>This is post one</h1>
      <img src=\\"/__assets__/8a418db75ee887428f385946cb3cf1.svg\\">
      <p><img src=\\"/__assets__/8a418db75ee887428f385946cb3cf1.svg\\" alt=\\"Tick\\"></p>",
          "fields": Object {},
          "frontMatter": Object {
            "date": 2020-12-12T00:00:00.000Z,
            "description": "This is a description",
            "title": "Post 1",
          },
          "link": "/blog/post-1/",
        },
        Object {
          "data": "<h1>Post 2</h1>
      <p>This is post 2</p>",
          "fields": Object {},
          "frontMatter": Object {
            "date": 2020-08-12T00:00:00.000Z,
            "description": "This is a description 2",
            "title": "Post 2",
          },
          "link": "/blog/post-2/",
        },
      ]
    `)
  })
})
