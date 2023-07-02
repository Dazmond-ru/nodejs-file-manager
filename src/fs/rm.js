import fsPromises from 'node:fs/promises'
import { cd } from '../nav/cd.js'

export const rm = async (currentPath, query) => {
  const inputPath = await cd(currentPath, query, false)

  try {
    const inputPathCheck = await fsPromises.lstat(inputPath)
    if (inputPathCheck.isFile()) {
      await fsPromises.unlink(inputPath)
    } else {
      console.log('Operation failed')
    }
  } catch {
    console.log('Operation failed')
  }
}
