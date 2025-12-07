const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec7input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split("\n");

var currentTachyons = [lines[0].indexOf("S")]
console.log(lines[0][currentTachyons])
let result = 0;
let drawing = [lines[0]]
for (let lineIdx in lines) {
    let line = lines[lineIdx]
    let newLine = line
    if (lineIdx === "0") continue;
    let newTachyons = []
    for (let tachyon of currentTachyons) {
        if (line[tachyon] === ".") {
            newLine = replaceAt(newLine, tachyon, "|")
            newTachyons.push(tachyon)
        }
        else if (line[tachyon] === "^") {
            result++
            newLine = replaceAt(newLine, tachyon - 1, "|")
            newLine = replaceAt(newLine, tachyon + 1, "|")

            newTachyons.push(tachyon - 1)
            newTachyons.push(tachyon + 1)
        }

    }

    drawing.push(newLine)
    currentTachyons = [...new Set(newTachyons)]
}
console.log("Result:", result)

function replaceAt(text, index, replacement) {
    return text.substring(0, index) + replacement + text.substring(index + replacement.length);

}
