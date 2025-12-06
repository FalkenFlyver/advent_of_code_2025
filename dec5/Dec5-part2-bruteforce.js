const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec5input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split("\n");

let freshNumbers = {}
let result = 0;
let lineCounter = 0;
for (let line of lines) {
    lineCounter++;

    console.log("Processing line " + Math.round((lineCounter / 182) * 100) + "%: " + line);
    if (line.indexOf("-") !== -1) {
        let range = line.split("-")
        for (let i = parseInt(range[0]); i <= parseInt(range[1]); i++) {
            freshNumbers[i] = true
        }
    }

}

console.error("Part 2 result: " + Object.keys(freshNumbers).length);