import path from 'node:path'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'

import { pipeline } from 'node:stream/promises'

import { cd } from '../nav/cd.js'
import { parsePathArgs } from '../utils/parsePathArgs.js'
import { pathExists } from '../utils/pathExists.js'

export const cp = async (currentPath, query) => {
  const inputPath = path.normalize(query.trim())

  const { firstArg, secondArg } = parsePathArgs(inputPath)

  try {
    const inputPathForRead = await cd(currentPath, firstArg, false)
    const inputPathForWriteWithoutFilename = await cd(
      currentPath,
      secondArg,
      false
    )

    const inputPathForWrite = path.join(
      inputPathForWriteWithoutFilename,
      path.basename(inputPathForRead)
    )

    if (!inputPathForRead || !inputPathForWriteWithoutFilename) {
      console.log('Operation failed')
      return
    }

    if (await pathExists(inputPathForWrite)) {
      console.log('Operation failed')
      return
    }

    const data = await fsPromises.stat(inputPathForRead)
    if (!data.isFile()) {
      console.log('Operation failed')
      return
    }

    if (
      currentPath === inputPathForWriteWithoutFilename &&
      path.basename(currentPath) !== path.basename(inputPathForRead)
    ) {
      console.log('Operation failed')
      return
    }

    const readable = fs.createReadStream(inputPathForRead)
    const writeable = fs.createWriteStream(inputPathForWrite)

    await pipeline(readable, writeable)
  } catch {
    console.log('Operation failed')
  }
}
