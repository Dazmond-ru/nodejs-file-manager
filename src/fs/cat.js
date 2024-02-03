import fs from 'fs'
import fsPromise from 'fs/promises'

import {cd} from '../nav/cd.js'

export const cat = async (currentPath, query) => {
    const inputPath = await cd(currentPath, query, false)
    const readStream = fs.createReadStream(inputPath)
    try {
        const inputPathCheck = await fsPromise.lstat(inputPath)
        let text = ''

        if (inputPathCheck.isFile()) {
            for await (const chunk of readStream) {
                text += chunk
            }
            console.log(text)
        } else {
            console.log('Operation failed')
        }
    } catch {
        console.log('Operation failed')
    }
}
