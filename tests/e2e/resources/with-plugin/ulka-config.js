module.exports = {
  pagesPath: "pages",
  templatesPath: "templates",
  plugins: ["plugin"],
  contents: [
    {
      path: "contents",
      generatePath: ".",
      template: "simple.ulka",
      name: "blog"
    }
  ]
}
