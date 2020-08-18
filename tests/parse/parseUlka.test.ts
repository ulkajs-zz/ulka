import parseUlka from '../../src/parse/parseUlka'

describe('parseUlka fuction', () => {
  test('should replace value in ulka template with provided value', async () => {
    const ulkatemplate = `<h1>My name is {% name %}. Github: {% url.github %}</h1>`
    const parsedUlka = await parseUlka(ulkatemplate, {
      name: 'Roshan',
      url: { github: 'https://www.github.com/acharyaroshanji' }
    })
    expect(parsedUlka.html).toBe(
      `<h1>My name is Roshan. Github: https://www.github.com/acharyaroshanji</h1>`
    )
  })
})
