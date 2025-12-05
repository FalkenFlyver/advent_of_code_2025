const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec3input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split("\n");

let result = 0;

for (let line of lines) {
    let numbersInLine = []
    for (let i = 0; i < line.length; i += 1) {
        let firstNumber = line[i]
        for (let k = i + 1; k < line.length; k += 1) {
            numbersInLine.push(parseInt(firstNumber + line.substring(k, k + 1)))
        }
    }
    result += Math.max(...numbersInLine)
}
console.log("part 1: " + result);