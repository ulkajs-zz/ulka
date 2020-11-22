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
  // function cannot be used as plugin
  plugins: [
    {
      resolve: "nice-plugin"
    },
    () => {}
  ]
}
