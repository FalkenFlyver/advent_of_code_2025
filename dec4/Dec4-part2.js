const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec4input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

let lines = rawInput.replace(/\r/g, '').split("\n")

let result = 0;
let toBeRemoved = []

function findRemovableBoxes() {
    let boxesFoundToBeRemoved = false
    for (let lineIdx in lines) {
        for (let elementIdx in lines[lineIdx]) {
            let char = lines[lineIdx][elementIdx];
            if (char === '@') {
                let adjacentCount = countAdjecent(parseInt(elementIdx), parseInt(lineIdx))
                if (adjacentCount < 4) {
                    toBeRemoved.push({ x: parseInt(elementIdx), y: parseInt(lineIdx) });
                    result++;
                    boxesFoundToBeRemoved = true;
                }
            }
        }
    }
    return boxesFoundToBeRemoved
}
function removeBoxes() {
    for (let box of toBeRemoved) {
        lines[box.y] = lines[box.y].substring(0, box.x) + '.' + lines[box.y].substring(box.x + 1);
    }
    toBeRemoved = []
}
while (findRemovableBoxes()) {
    removeBoxes()
}
console.log("Part 2 result: " + result);
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