import fs from 'fs'

const dataFromPath = (path: string) => {
  return {
    data: fs.readFileSync(path, 'utf-8'),
    path
  }
}

export default dataFromPath
