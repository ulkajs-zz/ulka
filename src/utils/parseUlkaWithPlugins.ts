import { parse } from 'ulka-parser'

const parseUlkaWithPlugins = async (
  ulkaTemplate: string,
  values: any,
  options: any,
  {
    beforeUlkaParse,
    afterUlkaParse
  }: { beforeUlkaParse: any; afterUlkaParse: any }
) => {
  for (let i = 0; i < beforeUlkaParse.length; i++) {
    const plugin = beforeUlkaParse[i]

    const data = await plugin(ulkaTemplate, values, options) // => { ulkaTemplate, values }

    ulkaTemplate = data.ulkaTemplate || ulkaTemplate
    const newValues = data.values || {}
    values = { ...values, ...newValues }
  }

  ulkaTemplate = await parse(ulkaTemplate, values, options)

  for (let i = 0; i < afterUlkaParse.length; i++) {
    const plugin = afterUlkaParse[i]
    ulkaTemplate = (await plugin(ulkaTemplate, values, options)) || ulkaTemplate // => string (html)
  }

  return ulkaTemplate
}

export default parseUlkaWithPlugins
