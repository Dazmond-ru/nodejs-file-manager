import path from 'node:path'
import { pathExists } from '../utils/pathExists.js'

export const cd = async (currentPath, query, isDirectory = true) => {
  let pathDir = query.trim()

  if (pathDir.includes(' ') && !pathDir.includes('"')) {
    console.log('Invalid input')
    return currentPath
  }

  let countDoubleQuotes = 0
  let isDoubleQuotesInPath = false
  let pathNormalize = path.normalize(pathDir)

  if (pathNormalize.at(-1) === path.sep && pathNormalize.length !== 1) {
    pathNormalize = pathNormalize.slice(0, -1)
  }

  const pathDirRes = pathNormalize
    .split(`${path.sep}`)
    .map((item, index) => {
      if (index === 0) {
        if (item[0] === '"') {
          item = item.slice(1)
          countDoubleQuotes++
        }

        if (item.at(-1) === '"') {
          item = item.slice(0, -1)
          countDoubleQuotes++
        }

        if (/^[A-Za-z]:{1}/.test(item) && countDoubleQuotes > 0) {
          countDoubleQuotes = 0
          isDoubleQuotesInPath = true
        }

        return item
      } else {
        if (item[0] === '"') {
          item = item.slice(1)
          countDoubleQuotes++
        }

        if (item.at(-1) === '"') {
          item = item.slice(0, -1)
          countDoubleQuotes++
        }
        return item
      }
    })
    .join(path.sep)

  if (countDoubleQuotes % 2 === 1 || isDoubleQuotesInPath) {
    console.log('Operation failed')
    return currentPath
  }
  pathDir = pathDirRes

  if (path.normalize(pathDir) === path.sep) {
    return currentPath.slice(0, 3)
  }

  if (isDirectory) {
    if (/^[A-Za-z]:{1}/.test(pathDir)) {
      if (pathDir.length === 3 && pathDir.at(-1) === '.')
        pathDir = pathDir.slice(0, -1) + `${path.sep}`
      if (pathDir.length === 2 && pathDir.at(-1) === ':')
        pathDir = pathDir + `${path.sep}`
      try {
        process.chdir(pathDir)
        return pathDir
      } catch (err) {
        console.log('Operation failed')
        return currentPath
      }
    }

    try {
      process.chdir(path.join(currentPath, pathDir))
      return path.join(currentPath, pathDir)
    } catch {
      console.log('Operation failed')
      return currentPath
    }
  }

  if (!isDirectory) {
    if (/^[A-Za-z]:{1}/.test(pathDir)) {
      if (pathDir.length === 3 && pathDir.at(-1) === '.')
        pathDir = pathDir.slice(0, -1) + `${path.sep}`
      if (await pathExists(path.join(pathDir))) {
        return pathDir
      } else {
        return currentPath
      }
    }

    if (await pathExists(path.join(currentPath, pathDir))) {
      return path.join(currentPath, pathDir)
    } else {
      return currentPath
    }
  }
}
