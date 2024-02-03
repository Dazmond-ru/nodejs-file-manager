import path from 'node:path'
import {writeFile} from 'node:fs/promises'

export const add = async (currentPath, query) => {
    let fileName = query.trim()

    if (fileName.includes(' ') && !fileName.includes('"')) {
        console.log('Invalid input')
        return currentPath
    }

    let countDoubleQuotes = 0

    if (fileName[0] === '"') {
        countDoubleQuotes++
        fileName = fileName.slice(1)
    }
    if (fileName.at(-1) === '"') {
        countDoubleQuotes++
        fileName = fileName.slice(0, -1)
    }

    if (countDoubleQuotes % 2 === 1) {
        console.log('Operation failed')
        return currentPath
    }

    try {
        await writeFile(path.join(currentPath, fileName.trim()), '', {
            flag: 'wx',
        })
    } catch {
        console.log('Operation failed')
    }
}
