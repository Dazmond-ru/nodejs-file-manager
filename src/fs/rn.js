import path from 'node:path'
import fsPromises from 'node:fs/promises'

import {parsePathArgs} from '../utils/parsePathArgs.js'
import {cd} from '../nav/cd.js'

export const rn = async (currentPath, query) => {
    const inputPath = path.normalize(query.trim())
    const {firstArg, secondArg} = parsePathArgs(inputPath)

    try {
        let prevFilePath = await cd(currentPath, firstArg, false)
        const newFileName = secondArg.split('"').join('')

        if (prevFilePath.at(-1) === path.sep) {
            prevFilePath = prevFilePath.slice(0, -1)
        }

        const newFilePath = path.join(
            prevFilePath.slice(0, prevFilePath.lastIndexOf(path.sep)),
            newFileName.trim()
        )

        await fsPromises.rename(prevFilePath, newFilePath)
    } catch {
        console.log('Operation failed')
    }
}
