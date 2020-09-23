import generateFileName from "../../src/utils/generate-file-name"

test("should generate hex hash from string", () => {
  const hash = generateFileName("/some/dir/to/the/file")
  expect(hash).toBe("8d13d85a2f8401154b2c40e2510266")
})
