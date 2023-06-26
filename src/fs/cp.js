import fs from "fs/promises";
import path from "node:path";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { parsePathArgs } from "../utils/parsePathArgs.js";
import { cd } from "./cd.js";
import { pathExists } from "../utils/pathExists.js";

export const cp = async (currentPath, query) => {
  const inputPath = path.normalize(query.slice(3));
  const { firstArg, secondArg } = parsePathArgs(inputPath);

  if (firstArg && secondArg) {
    let inputPathForWrite;
    let secondArgNormalize = path.normalize(secondArg);
    const inputPathForRead = await cd(currentPath, "cd " + firstArg, false);
    const inputPathForWriteWithoutFilename = await cd(
      currentPath,
      "cd " + secondArg,
      false
    );

    if (inputPathForRead[inputPathForRead.length - 1] === path.sep) {
      inputPathForRead = inputPathForRead.slice(0, -1);
      inputPathForWrite = path.join(
        inputPathForWriteWithoutFilename,
        inputPathForRead.slice(inputPathForRead.lastIndexOf(path.sep))
      );
    } else {
      inputPathForWrite = path.join(
        inputPathForWriteWithoutFilename,
        inputPathForRead.slice(inputPathForRead.lastIndexOf(path.sep))
      );
    }

    if (secondArgNormalize[secondArgNormalize.length - 1] === path.sep) {
      secondArgNormalize = secondArgNormalize.slice(0, -1);
      if (!secondArgNormalize.includes(path.sep))
        secondArgNormalize = path.sep + secondArgNormalize;
    }

    try {
      const data = await fs.lstat(inputPathForRead);
      if (!data.isFile()) {
        return process.stdout.write("Operation failed\n");
      }
    } catch {
      return process.stdout.write("Operation failed\n");
    }

    if (
      currentPath === inputPathForWriteWithoutFilename &&
      currentPath.slice(currentPath.lastIndexOf(path.sep)) !==
        secondArgNormalize.slice(secondArgNormalize.lastIndexOf(path.sep))
    ) {
      return process.stdout.write("Operation failed\n");
    }

    if (await pathExists(inputPathForWrite)) {
      return process.stdout.write("Operation failed\n");
    } else {
      const readable = createReadStream(inputPathForRead, "utf-8");
      const writeable = createWriteStream(inputPathForWrite, "utf-8");

      try {
        await pipeline(readable, writeable);
      } catch {
        return process.stdout.write("Operation failed\n");
      }
    }
  } else {
    return process.stdout.write(`Invalid input\n`);
  }
};
