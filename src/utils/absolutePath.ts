import path from 'path'

const absolutePath = (args: string) => {
  if (typeof args !== 'string') {
    throw new Error('Path provided should be string')
  }
  return path.join(process.cwd(), ...args.split('/'))
}

export default absolutePath
