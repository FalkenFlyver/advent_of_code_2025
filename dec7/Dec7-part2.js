const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec7input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split("\n");

var currentTachyons = [{ line: lines[0].indexOf("S"), value: 1 }]
var currentTachyonsCount = []
console.log(lines[0][currentTachyons])
let result = 0;
let drawing = [lines[0]]
for (let lineIdx in lines) {
    let line = lines[lineIdx]
    let newLine = line
    if (lineIdx === "0") continue;
    let newTachyons = []
    for (let tachyonIdx in currentTachyons) {
        let tachyon = currentTachyons[tachyonIdx];
        if (line[tachyon.line] === ".") {
            newLine = replaceAt(newLine, tachyon.line, tachyon.value.toString())
            let existingStraight = newTachyons.filter(x => x.line == tachyon.line)[0]
            if (existingStraight) {
                existingStraight.value += tachyon.value
            }
            else
                newTachyons.push({ line: tachyon.line, value: tachyon.value })
        }
        else if (line[tachyon.line] === "^") {
            let leftValue = currentTachyons[tachyonIdx].value + (newTachyons.filter(x => x.line == tachyon.line - 1)[0] ? newTachyons.filter(x => x.line == tachyon.line - 1)[0].value : 0)
            let rightValue = currentTachyons[tachyonIdx].value + (newTachyons.filter(x => x.line == tachyon.line + 1)[0] ? newTachyons.filter(x => x.line == tachyon.line + 1)[0].value : 0)
            newLine = replaceAt(newLine, tachyon.line - 1, leftValue.toString())
            newLine = replaceAt(newLine, tachyon.line + 1, rightValue.toString())

            let existingLeft = newTachyons.filter(x => x.line == tachyon.line - 1)[0]
            if (existingLeft) {
                existingLeft.value = leftValue
            }
            else
                newTachyons.push({ line: tachyon.line - 1, value: leftValue })

            let existingRight = newTachyons.filter(x => x.line == tachyon.line + 1)[0]
            if (existingRight) {
                existingRight.value = rightValue
            }
            else
                newTachyons.push({ line: tachyon.line + 1, value: rightValue })
        }

    }

    drawing.push(newLine)

    currentTachyons = [...new Set(newTachyons)]
}
currentTachyons.forEach(x => result += x.value)
console.log("Result:", result)

function replaceAt(text, index, replacement) {
    return text.substring(0, index) + replacement + text.substring(index + replacement.length);

}
