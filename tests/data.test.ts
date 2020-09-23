import configs from "../src/data/configs"
import mimeTypes from "../src/data/mime-types"

test("should have default configs data", () => {
  expect(configs).toMatchInlineSnapshot(`
    Object {
      "buildPath": "build",
      "contents": Array [],
      "pagesPath": "pages",
      "plugins": Array [],
      "templatesPath": "templates",
    }
  `)
})

test("should have all mime types", () => {
  expect(mimeTypes).toMatchInlineSnapshot(`
    Object {
      ".css": "text/css",
      ".doc": "application/msword",
      ".eot": "application/vnd.ms-fontobject",
      ".html": "text/html",
      ".ico": "image/x-icon",
      ".jpg": "image/jpeg",
      ".js": "text/javascript",
      ".json": "application/json",
      ".mp3": "audio/mpeg",
      ".pdf": "application/pdf",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".ttf": "application/x-font-ttf",
      ".wav": "audio/wav",
      ".xml": "application/xml",
      ".zip": "application/zip",
    }
  `)
})
