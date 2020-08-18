import generateFileName from '../../src/utils/generateName'

describe('Generatefilename function', () => {
  describe('on given /path/to/file', () => {
    test('should return 53a468bbb5755f5f8f9734be0bc3da', () => {
      const fileName = generateFileName('/path/to/file')
      expect(fileName).toBe('53a468bbb5755f5f8f9734be0bc3da')
    })
  })

  describe('on given nothing', () => {
    test('should throw error', () => {
      expect(generateFileName).toThrow('FilePath provided should be string')
    })
  })

  describe('on given number', () => {
    test('should throw error', () => {
      // @ts-ignore
      expect(() => generateFileName(1)).toThrow(
        'FilePath provided should be string'
      )
    })
  })
})
