import fs from 'fs'
import absolutePath from '../utils/absolutePath'

const createDirectories = async (pathname: string) => {
  pathname = pathname.replace(/^\.*\/|\/?[^/]+\.[a-z]+|\/$/g, '')
  return await fs.promises.mkdir(absolutePath(pathname), {
    recursive: true
  })
}

export default createDirectories
