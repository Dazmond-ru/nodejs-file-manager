import os from 'node:os'
import { parseArg } from './cli/args.js'
import { up } from './fs/up.js'
import { cd } from './fs/cd.js'
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'process'
import { list } from './fs/ls.js'

let currentPath = os.homedir()
const username = parseArg()
const rl = readline.createInterface({ input, output })

rl.setPrompt(`You are currently in ${currentPath}\n\n`)
rl.prompt()

rl.on('line', async (query) => {
  if (query === '.exit') {
    rl.setPrompt(`\nThank you for using File Manager, ${username}, goodbye!`)
    rl.prompt()
    rl.close()
  }

  if (query === 'up') {
    currentPath = up(currentPath)
    rl.setPrompt(`You are currently in ${currentPath}\n`)
    rl.prompt()
  }

  if (query.startsWith('cd ')) {
    currentPath = await cd(currentPath, query)
    rl.setPrompt(`You are currently in ${currentPath}\n`)
    rl.prompt()
  }

  if (query === 'ls') {
    const folderContain = await list(currentPath)
    console.table(folderContain)
    rl.setPrompt(`You are currently in ${currentPath}\n`)
    rl.prompt()
  }
})

rl.on('SIGINT', () => {
  rl.write(`\nThank you for using File Manager, ${username}, goodbye!`)
  rl.close()
})
