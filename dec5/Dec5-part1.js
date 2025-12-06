const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec5input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split("\n");

let freshRanges = []
let result = 0;
for (let line of lines) {
    if (line.indexOf("-") !== -1) {
        let range = line.split("-")
        freshRanges.push({ start: parseInt(range[0]), end: parseInt(range[1]) })
    }
    else {
        result += testIfInRange(line) ? 1 : 0
    }
}
function testIfInRange(number) {
    for (let range of freshRanges) {
        if (number >= range.start && number <= range.end) {
            return true
        }
    }
    return false
}
console.error("Part 1 result: " + result);