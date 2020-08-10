const parseMd = require('../src/parse/parseMd')
const { configs } = require('../src')

describe('on given markdown', () => {
  test('should return proper html', async () => {
    const markdown = `# Hello World`
    const parsedMarkdown = await parseMd(markdown)
    expect(parsedMarkdown.html).toBe('<h1>Hello World</h1>')
  })

  test('should return proper frontMatter', async () => {
    const markdown = `---\ntitle: "Roshan Acharya"\n---`
    const parsedMarkdown = await parseMd(markdown)
    expect(parsedMarkdown.frontMatter.title).toBe('Roshan Acharya')
  })
})

describe('Using ulka syntax inside markdown', () => {
  describe('on given {% configs.buildPath %}', () => {
    test('should return <p>build</p>', async () => {
      const markdown = `{% configs.buildPath %}`
      const parsedMarkdown = await parseMd(markdown)
      expect(parsedMarkdown.html).toBe('<p>build</p>')
    })
  })

  describe('on given # {% 2 + 3 %}', () => {
    test('should return <h1>5</h1>', async () => {
      const markdown = `# {% 2 + 3 %}`
      const parsedMarkdown = await parseMd(markdown)
      expect(parsedMarkdown.html).toBe('<h1>5</h1>')
    })
  })
})

describe('Using postPrase function', () => {
  describe('PostPrase function returning empty string', () => {
    test('should return empty string', async () => {
      configs.contents.postParse.push(() => '')

      const parsedMarkdown = await parseMd('# Hello World')

      configs.contents.postParse = []

      expect(parsedMarkdown.html).toBe('')
    })
  })

  describe('Postparse function return h2 instead of h1', () => {
    test('should return <h2>Hello World</h2> on given # Hello World', async () => {
      configs.contents.postParse.push(html => html.replace(/h1/g, 'h2'))

      const parsedMarkdown = await parseMd('# Hello World')

      configs.contents.postParse = []

      expect(parsedMarkdown.html).toBe('<h2>Hello World</h2>')
    })
  })
})

describe('Using prePrase function', () => {
  describe('preParse function returning "# Hello World"', () => {
    test('should return <h1>Hello World</h1>', async () => {
      configs.contents.preParse.push(() => '# Hello World')

      const parsedMarkdown = await parseMd('# Hi I am Roshan Acharya')

      configs.contents.preParse = []

      expect(parsedMarkdown.html).toBe('<h1>Hello World</h1>')
    })
  })

  describe('prePrase function returning # instead instead of ##', () => {
    test('should return <h2>Hello World</h2> on given # Hello World', async () => {
      configs.contents.preParse.push(md => md.replace(/## /g, '# '))

      const parsedMarkdown = await parseMd('## Hello World')

      configs.contents.preParse = []

      expect(parsedMarkdown.html).toBe('<h1>Hello World</h1>')
    })
  })
})
