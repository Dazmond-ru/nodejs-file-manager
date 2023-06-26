import os from 'node:os';
import { parseArg } from "./cli/args.js";
import { up } from "./fs/up.js";
import { cd } from './fs/cd.js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'process';
import { list } from './fs/ls.js';
import { cat } from './fs/cat.js';

let currentPath = os.homedir();
const username = parseArg(currentPath);
const rl = readline.createInterface({ input, output });

rl.on( 'line' , async (query) => {
  if (query === '.exit') {
    process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!`);
    rl.close();
  }

  if (query === 'up') {
    currentPath = up(currentPath);
    process.stdout.write(`You are currently in ${currentPath}\n`);
  }

  if (query.startsWith('cd ')) {
    const isDirectoryCheck = true;
    currentPath = await cd(currentPath, query, isDirectoryCheck);
    process.stdout.write(`You are currently in ${currentPath}\n`);
  }

  if (query === 'ls') {
    const folderContain = await list(currentPath);
    console.table(folderContain);
    process.stdout.write(`You are currently in ${currentPath}\n`);
  }

  if (query.startsWith('cat ')) {
    rl.pause();
    await cat(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    rl.resume();
  }   
});

rl.on('SIGINT', async () => {
    process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!`); 
    rl.close();
});
