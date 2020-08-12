const parseMd = require('../../src/parse/parseMd')
const { configs } = require('../../src/globalInfo')

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
  test('on given {% configs.buildPath %} should return <p>build</p>', async () => {
    const markdown = `{% configs.buildPath %}`
    const parsedMarkdown = await parseMd(markdown)
    expect(parsedMarkdown.html).toBe('<p>build</p>')
  })

  test('on given # {% 2 + 3 %} should return <h1>5</h1>', async () => {
    const markdown = `# {% 2 + 3 %}`
    const parsedMarkdown = await parseMd(markdown)
    expect(parsedMarkdown.html).toBe('<h1>5</h1>')
  })
})

describe('Using postPrase function', () => {
  test('PostPrase function returning empty string should return empty string', async () => {
    configs.contents.postParse.push(() => '')

    const parsedMarkdown = await parseMd('# Hello World')

    configs.contents.postParse = []

    expect(parsedMarkdown.html).toBe('')
  })

  test('Postparse function return h2 instead of h1 should return <h2>Hello World</h2> on given # Hello World', async () => {
    configs.contents.postParse.push(html => html.replace(/h1/g, 'h2'))

    const parsedMarkdown = await parseMd('# Hello World')

    configs.contents.postParse = []

    expect(parsedMarkdown.html).toBe('<h2>Hello World</h2>')
  })
})

describe('Using prePrase function', () => {
  test('preParse function returning "# Hello World" should return <h1>Hello World</h1>', async () => {
    configs.contents.preParse.push(() => '# Hello World')

    const parsedMarkdown = await parseMd('# Hi I am Roshan Acharya')

    configs.contents.preParse = []

    expect(parsedMarkdown.html).toBe('<h1>Hello World</h1>')
  })

  test('prePrase function returning # instead instead of ## should return <h2>Hello World</h2> on given # Hello World', async () => {
    configs.contents.preParse.push(md => md.replace(/## /g, '# '))

    const parsedMarkdown = await parseMd('## Hello World')

    configs.contents.preParse = []

    expect(parsedMarkdown.html).toBe('<h1>Hello World</h1>')
  })
})
