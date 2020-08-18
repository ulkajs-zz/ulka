import fs from 'fs'
import absolutePath from '../utils/absolutePath'

const removeDirectories = async (pathname: string) => {
  pathname = pathname.replace(/^\.*\/|\/?[^/]+\.[a-z]+|\/$/g, '')
  return await fs.promises.rmdir(absolutePath(pathname), {
    recursive: true
  })
}

export default removeDirectories
