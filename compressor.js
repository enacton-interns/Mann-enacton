import fs from "fs/promises";
import zlib from "zlib";
import { promisify } from "util";
import chalk from "chalk"

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export async function compress(path) {
  try {
    const data = await fs.readFile(path, "utf-8");
    const buffer = await gzip(data);
    await fs.writeFile("./Output/compressed.txt", buffer.toString("base64"));
    console.log(chalk.blue("Compressed data saved to compressed.txt"));
  } catch (err) {
    console.error(err);
  }
}

export async function decompress(path) {
    try {
        const data = await fs.readFile(path, "utf-8");
        const buffer = Buffer.from(data, "base64");
        const decompressedData = await gunzip(buffer);
        await fs.writeFile("./Output/decompressed.txt", decompressedData.toString("utf-8"));
        console.log(chalk.blue("Decompressed data saved to decompressed.txt"));
    } catch (err) {
        console.error(err);
    }
}