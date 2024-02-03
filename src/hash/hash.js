import fs from 'fs/promises'
import fsPromises from 'node:fs/promises'
import {createHash} from 'node:crypto'

import {cd} from '../nav/cd.js'

export const hash = async (currentPath, query) => {
    const inputPath = await cd(currentPath, query, false)

    try {
        const inputPathCheck = await fs.lstat(inputPath)
        if (inputPathCheck.isFile()) {
            const content = await fsPromises.readFile(inputPath)
            const hashSha = createHash('sha256')

            hashSha.update(content)
            console.log(`${hashSha.digest('hex')}`)
        } else {
            console.log('Operation failed')
        }
    } catch {
        console.log('Operation failed')
    }
}
