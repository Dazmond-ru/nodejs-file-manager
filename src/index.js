import os from 'node:os'
import { parseArg } from './cli/args.js'
import { up } from './fs/up.js'

let currentPath = os.homedir()
const username = parseArg()
process.stdout.write(`You are currently in ${currentPath}\n`)

const echoInput = (chunk) => {
  const inputChunk = chunk.toString().trim()

  if (inputChunk === '.exit') {
    process.stdout.write(
      `Thank you for using File Manager, ${username}, goodbye!`
    )
    process.exit()
  }
  if (inputChunk === 'up') {
    currentPath = up(currentPath) + '\n'
  }
  process.stdout.write(`You are currently in ${currentPath}`)
}

process.stdin.on('data', echoInput)

process.on('SIGINT', () => {
  process.stdout.write(
    `\nThank you for using File Manager, ${username}, goodbye!`
  )
  process.exit()
})
