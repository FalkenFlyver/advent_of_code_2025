const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec4input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split("\n");

let result = 0;
for (let lineIdx in lines) {
    for (let elementIdx in lines[lineIdx]) {
        let char = lines[lineIdx][elementIdx];
        if (char === '@') {
            let adjacentCount = countAdjecent(parseInt(elementIdx), parseInt(lineIdx))
            if (adjacentCount < 4) {
                result++;
            }
        }
    }
}
console.log("Part 1 result: " + result);
function countAdjecent(x, y) {
    let result = 0;
    try {
        result += lines[y][x - 1] === '@' ? 1 : 0
    } catch { }
    try {
        result += lines[y][x + 1] === '@' ? 1 : 0
    } catch { }
    try {
        result += lines[y + 1][x] === '@' ? 1 : 0
    } catch { }
    try {
        result += lines[y - 1][x] === '@' ? 1 : 0
    } catch { }
    try {
        result += lines[y + 1][x + 1] === '@' ? 1 : 0
    } catch { }
    try {
        result += lines[y - 1][x - 1] === '@' ? 1 : 0
    } catch { }
    try {
        result += lines[y + 1][x - 1] === '@' ? 1 : 0
    } catch { }
    try {
        result += lines[y - 1][x + 1] === '@' ? 1 : 0
    } catch { }
    return result
}