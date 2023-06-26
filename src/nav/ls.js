import path from 'node:path'
import { readdir } from 'node:fs/promises'

export const ls = async (currentPath) => {
  try {
    const allData = await readdir(path.normalize(currentPath), {
      withFileTypes: true,
    })

    const res = allData.map((data) => {
      return { Name: data.name, Type: data.isFile() ? 'file' : 'directory' }
    })

    const directoriesResult = res.sort((a, b) => {
      if (a.Type === b.Type) {
        return a.Name.localeCompare(b.Name)
      }
      return a.Type.localeCompare(b.Type)
    })

    return directoriesResult
  } catch {
    console.log('Operation failed')
  }
}
