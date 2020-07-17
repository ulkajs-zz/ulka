const frontmatter = require("front-matter");
const { Remarkable } = require("remarkable");

const md = new Remarkable({
  html: true,
});

const parseMd = (markdown) => {
  const data = frontmatter(markdown);
  const toHtml = md.render(data.body);
  return {
    frontMatter: data.attributes,
    html: toHtml.trim(),
  };
};

module.exports = parseMd;
