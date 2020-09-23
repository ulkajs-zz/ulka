import generateFileName from "../../src/utils/generate-file-name"

test("should generate hex hash from string", () => {
  const hash = generateFileName("/some/dir/to/the/file")
  expect(hash).toBe("ae6cc2a3ceca811802a13be887ca79")
})
