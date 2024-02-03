import fs from 'node:fs'
import fsPromises from 'fs/promises'
import path from 'node:path'

import {pipeline} from 'stream/promises'
import {createBrotliCompress} from 'node:zlib'

import {cd} from '../nav/cd.js'
import {parsePathArgs} from '../utils/parsePathArgs.js'
import {pathExists} from '../utils/pathExists.js'

export const compress = async (currentPath, query) => {
    const inputPath = path.normalize(query)
    const {firstArg, secondArg} = parsePathArgs(inputPath)

    if (firstArg && secondArg) {
        let firstArgNormalize = path.normalize(firstArg)
        let secondArgNormalize = path.normalize(secondArg)

        const {
            dir: dirSecondArg,
            base: baseSecondArg,
            ext: extSecondArg,
        } = path.parse(secondArgNormalize)

        if (extSecondArg !== '.br') {
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
            const readable = fs.createReadStream(inputPathForRead, 'utf-8')
            const writeable = fs.createWriteStream(inputPathForWrite, 'utf-8')
            const compressBrotli = createBrotliCompress()

            try {
                await pipeline(readable, compressBrotli, writeable)
            } catch {
                console.log('Operation failed')
            }
        }
    } else {
        console.log(`Invalid input`)
    }
}
