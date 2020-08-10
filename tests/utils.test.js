const absolutePath = require('../src/utils/absolutePath')
const path = require('path')
const generateFileName = require('../src/utils/generateName')

describe('AbsolutePath function', () => {
  describe('on given path/to/file', () => {
    test('should return a absolute path', () => {
      expect(absolutePath('path/to/file')).toBe(
        path.join(process.cwd(), ...'path/to/file'.split('/'))
      )
    })
  })

  describe('on given empty string', () => {
    test('should retrun cwd', () => {
      expect(absolutePath('')).toBe(process.cwd())
    })
  })

  describe('on given other than string', () => {
    test('should throw error', () => {
      expect(absolutePath).toThrow('Path provided should be string')
      expect(() => absolutePath(1)).toThrow('Path provided should be string')
    })
  })
})

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
      expect(() => generateFileName(1)).toThrow(
        'FilePath provided should be string'
      )
    })
  })
})
