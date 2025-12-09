const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec9input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.split(/[\r\n]+/).map((x, xi) => x.split(',').map(Number))


const allAreas = []
for (let pos1idx in lines) {
    let pos1 = lines[pos1idx]
    for (let pos2idx = 0; pos2idx < lines.length; pos2idx++) {
        let pos2 = lines[pos2idx]
        allAreas.push({ pos1: parseInt(pos1idx), pos2: pos2idx, area: calculateArea(pos1, pos2) })
    }
}
function calculateArea(pos1, pos2) {
    let distanceX = Math.abs(pos1[0] - pos2[0] + 1)
    let distanceY = Math.abs(pos1[1] - pos2[1] + 1)
    return distanceX * distanceY
}
console.log("part1: " + allAreas.sort((a, b) => b.area - a.area)[0].area)
