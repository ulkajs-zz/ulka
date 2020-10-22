module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/utils/**/*.js",
    "src/index.js",
    "src/ulka-cli/build.js"
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
