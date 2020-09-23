module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      functions: 90,
      lines: 80,
      statements: 80,
      branches: 50
    }
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
}
