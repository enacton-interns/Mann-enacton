import dotenv from "dotenv"
import chalk from "chalk";
import fs from "fs/promises"
dotenv.config()
import readline from "readline-sync"
import { convertToUpperCase, convertToLowerCase, checkPalindrome } from "./string.js"
import { compress, decompress } from "./compressor.js"
import getJoke from "./api.js"

let choice = 0
let path;
let input;
console.log(chalk.bold.red("\n CLI TOOL\n"))
while (true) {

    console.log(chalk.bold.yellowBright("1. UpperCase"))
    console.log(chalk.bold.yellowBright("2. Lowercase"))
    console.log(chalk.bold.yellowBright("3. Palindrome"))
    console.log(chalk.bold.yellowBright("4. Joke"))
    console.log(chalk.bold.yellowBright("5. Compress"))
    console.log(chalk.bold.yellowBright("6. Decompress"))
    console.log(chalk.bold.yellowBright("7. Exit"))

    choice = readline.question("Enter your choice: ")
    if (choice == "7" || choice.toLowerCase() == "exit") {
        console.log(chalk.bold.yellowBright("Exited successfully\n"))
        process.exit(0)
    }
    if(choice < Number("4")){
        input = readline.question("Enter a string value: ")
    }

    switch (choice) {
        case "1":
            console.log(chalk.bold.bgGreen(convertToUpperCase(input)));
            break
        case "2":
            console.log(chalk.bold.bgGreen(convertToLowerCase(input)));
            break
        case "3":
            console.log(chalk.bold.bgGreen(checkPalindrome(input)));
            break
        case "4":
            const joke = await getJoke()
            console.log(chalk.bold.bgGreen(joke.joke || joke.setup + "\n" + joke.delivery))
            break
        case "5" :
            path = readline.question("Enter file path to compress : "); // File path to be entered : ./hello.txt
            await compress(path);
            break
        case "6" :
            path = readline.question("Enter file path to compress : "); // File path to be entered : ./Output/compressed.txt
            await decompress(path);
            break
        default:
            console.log(chalk.bold.redBright("Invalid choice"))
    }
}
