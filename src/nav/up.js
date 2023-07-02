import path from 'node:path'

export const up = (currentPath) => {
  const prevPathArr = currentPath.split(path.sep)

  if (prevPathArr.length > 1) prevPathArr.pop()

  if (prevPathArr.length === 1) {
    const newPath = path.join(...prevPathArr, path.sep)
    return newPath
  }

  const newPath = path.join(...prevPathArr)

  process.chdir(newPath)
  return newPath
}
