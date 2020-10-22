module.exports = {
  beforeContentRender({ contentData }) {
    contentData.values.fields.readingTime = "1min"
  },
  beforePageRender(data) {
    data.pageData.values.myData = {
      name: "Roshan Acharya",
      age: 20
    }
  },
  beforeBuild() {},
  afterBuild() {},
  beforeSetup() {},
  remarkablePlugin() {},
  afterContentRender() {},
  afterPageRender() {}
}
