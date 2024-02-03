import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'

import {pipeline} from 'stream/promises'
import {createBrotliDecompress} from 'node:zlib'

import {parsePathArgs} from '../utils/parsePathArgs.js'
import {pathExists} from '../utils/pathExists.js'
import {cd} from '../nav/cd.js'

export const decompress = async (currentPath, query) => {
    const inputPath = path.normalize(query)
    const {firstArg, secondArg} = parsePathArgs(inputPath)

    if (firstArg && secondArg) {
        let firstArgNormalize = path.normalize(firstArg)
        let secondArgNormalize = path.normalize(secondArg)
        const {ext: extFirstArg} = path.parse(firstArgNormalize)
        const {dir: dirSecondArg, base: baseSecondArg} =
            path.parse(secondArgNormalize)

        if (extFirstArg !== '.br') {
            console.log('Invalid input')
            return
        }

        const inputPathForRead = await cd(currentPath, firstArgNormalize, false)
        const inputPathForWriteWithoutFilename = await cd(
            currentPath,
            dirSecondArg,
            false
        )

        let inputPathForWrite = path.join(
            inputPathForWriteWithoutFilename,
            baseSecondArg
        )

        try {
            const data = await fsPromises.lstat(inputPathForRead)
            if (!data.isFile()) {
                console.log('Operation failed')
                return
            }
        } catch {
            console.log('Operation failed')
            return
        }

        if (
            currentPath === inputPathForWriteWithoutFilename &&
            (dirSecondArg.length === 0
                ? false
                : currentPath.slice(currentPath.lastIndexOf(path.sep)) !==
                dirSecondArg.slice(dirSecondArg.lastIndexOf(path.sep)))
        ) {
            console.log('Operation failed')
            return
        }

        if (await pathExists(inputPathForWrite)) {
            console.log('Operation failed')
        } else {
            const readable = fs.createReadStream(inputPathForRead)
            const decompressBrotli = createBrotliDecompress()
            const writeable = fs.createWriteStream(inputPathForWrite)

            try {
                await pipeline(readable, decompressBrotli, writeable)
            } catch {
                console.log('Operation failed')
            }
        }
    } else {
        console.log(`Invalid input`)
    }
}
