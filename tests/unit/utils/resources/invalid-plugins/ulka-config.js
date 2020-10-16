module.exports = {
  buildPath: "build",
  pagesPath: "pages",
  templatesPath: "templates",
  contents: [
    {
      path: "contents",
      template: "blog.ulka"
    }
  ],
  // bad-plugin doesn't exist
  plugins: [
    {
      resolve: "nice-plugin"
    },
    () => {},
    "bad-plugin"
  ]
}
