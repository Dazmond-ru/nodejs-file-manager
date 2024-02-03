import path from 'node:path'
import fsPromises from 'node:fs/promises'

import {cd} from '../nav/cd.js'
import {cp} from './cp.js'

import {parsePathArgs} from '../utils/parsePathArgs.js'

export const mv = async (currentPath, query) => {
    const inputPath = path.normalize(query).trim()
    const {firstArg} = parsePathArgs(inputPath)

    try {
        const destinationFile = await cp(currentPath, query)

        if (!destinationFile) {
            const inputPath = await cd(currentPath, firstArg, false)
            await fsPromises.unlink(inputPath)
        }
    } catch {
        console.log('Operation failed')
    }
}
