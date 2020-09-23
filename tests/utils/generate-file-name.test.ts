import path from "path"
import generateFileName from "../../src/utils/generate-file-name"

test("should generate hex hash from string", () => {
  const hash = generateFileName(path.join(process.cwd(), "haha", "hehe"))
  expect(hash).toBe("9284bcc28176038385cf517026b753")
})
