import { parseArg } from './cli/args.js'

const username = parseArg()

const echoInput = (chunk) => {
  const inputChunk = chunk.toString().trim()

  if (inputChunk === '.exit') {
    process.stdout.write(
      `Thank you for using File Manager, ${username}, goodbye!`
    )
    process.exit()
  }
}

process.stdin.on('data', echoInput)
process.on('SIGINT', () => {
  process.stdout.write(
    `Thank you for using File Manager, ${username}, goodbye!`
  )
  process.exit()
})
