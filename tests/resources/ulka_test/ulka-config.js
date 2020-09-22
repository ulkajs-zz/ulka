const testPlugin = require("./plugins/testPlugin")

module.exports = {
  siteMetaData: {
    title: "UlkaJs",
    description: "This is a default starter for ulka js"
  },
  buildPath: "build",
  pagesPath: "pages",
  templatesPath: "templates",
  plugins: [testPlugin],
  contents: [
    {
      path: "contents",
      generatePath: "blog",
      template: "blog.ulka"
    }
  ]
}
