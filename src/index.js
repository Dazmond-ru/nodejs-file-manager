import * as readline from 'node:readline/promises'
import os from 'node:os'

import { exitFileManager } from './utils/exitFileManager.js'
import { printCurrentPath } from './utils/printCurrentPath.js'

import { parseArg } from './cli/args.js'

import { up } from './nav/up.js'
import { cd } from './nav/cd.js'
import { ls } from './nav/ls.js'

import { cat } from './fs/cat.js'
import { add } from './fs/add.js'
import { rn } from './fs/rn.js'
import { cp } from './fs/cp.js'
import { mv } from './fs/mv.js'
import { rm } from './fs/rm.js'

import { osFM } from './os/osFM.js'

import { hash } from './hash/hash.js'

import { compress } from './zip/compress.js'
import { decompress } from './zip/decompress.js'

let currentPath = os.homedir()
const username = parseArg(currentPath)

console.log(
  `Welcome to the File Manager, ${username}!\nYou are currently in ${currentPath}`
)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('line', async (query) => {
  const args = query.split(' ').splice(1).join(' ').trim()

  if (query === '.exit') {
    exitFileManager(username)
    rl.close()
    return
  }

  if (query === 'up') {
    currentPath = up(currentPath)
    printCurrentPath(currentPath)
    return
  }

  if (query.startsWith('cd ')) {
    rl.pause()
    currentPath = await cd(currentPath, args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query === 'ls') {
    rl.pause()
    const folderContain = await ls(currentPath)
    console.table(folderContain)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query.startsWith('cat ')) {
    rl.pause()
    await cat(currentPath, args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query.startsWith('add ')) {
    rl.pause()
    await add(currentPath, args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query.startsWith('rn ')) {
    rl.pause()
    await rn(currentPath, args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query.startsWith('cp ')) {
    rl.pause()
    await cp(currentPath, args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query.startsWith('mv ')) {
    rl.pause()
    await mv(currentPath, args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query.startsWith('rm ')) {
    rl.pause()
    await rm(currentPath, args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query.startsWith('os ')) {
    rl.pause()
    await osFM(args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query.startsWith('hash ')) {
    rl.pause()
    await hash(currentPath, args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query.startsWith('compress ')) {
    rl.pause()
    await compress(currentPath, args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  }

  if (query.startsWith('decompress ')) {
    rl.pause()
    await decompress(currentPath, args)
    printCurrentPath(currentPath)
    rl.resume()
    return
  } else {
    console.log(`Invalid input`)
    printCurrentPath(currentPath)
    return
  }
})

rl.on('SIGINT', async () => {
  exitFileManager(username)
  rl.close()
})
