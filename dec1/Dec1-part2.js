const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec1input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split('\n');


let startPos = 50;
let total = startPos;
let resultCounter = 0;
console.log("start pos: " + startPos)
for (var val in lines) {
    processLine(lines[val]);

}
console.log("part 2 result: " + resultCounter)
function processLine(line) {
    if (line[0] === 'L') {
        subtractNumber(line.substring(1))
    }
    if (line[0] === 'R') {
        addNumber(line.substring(1))
    }
}
function subtractNumber(num) {
    let startedAtZero = (total == 0);
    num = parseInt(num);
    resultCounter += Math.floor(Math.abs(num) / 100)
    total -= (Math.abs(num) % 100);
    if (total == 0)
        resultCounter++
    while (total < 0) {
        total += 100;
        if (!startedAtZero)
            resultCounter++
        else startedAtZero = false
    }


}
function addNumber(num) {

    num = parseInt(num);

    resultCounter += Math.floor(Math.abs(num) / 100)
    total += (Math.abs(num) % 100);

    while (total >= 100) {
        total -= 100;
        resultCounter++
        //  if (startedAtZero)
        //      startedAtZero = false;
    }

}

module.exports = { rawInput, lines };