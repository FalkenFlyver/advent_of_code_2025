const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec9input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.split(/[\r\n]+/).map((x, xi) => x.split(',').map(Number))

const { pointInPolygon, rectangleFullyInPolygon } = require('../utils');


let candidates = [];
for (let pos1idx = 0; pos1idx < lines.length; pos1idx++) {
    const pos1 = lines[pos1idx];
    for (let pos2idx = 0; pos2idx < lines.length; pos2idx++) {
        if (pos1idx === pos2idx) continue;
        const pos2 = lines[pos2idx];

        const cornerA = pos1;
        const cornerB = pos2;
        const cornerC = [pos1[0], pos2[1]];
        const cornerD = [pos2[0], pos1[1]];

        // Fast check: all four rectangle corners must be inside polygon (inclusive)
        if (pointInPolygon(lines, cornerA) && pointInPolygon(lines, cornerB) && pointInPolygon(lines, cornerC) && pointInPolygon(lines, cornerD)) {
            candidates.push({ pos1: pos1idx, pos2: pos2idx, area: calculateArea(pos1, pos2) });
        }
    }
}

// Sort candidates by descending area
const sorted = candidates.sort((a, b) => b.area - a.area);
console.log('Total candidates after corner check:', sorted.length);
let found = null;
for (let i = 0; i < sorted.length; i++) {
    const c = sorted[i];
    if (i % 100 === 0) console.log("Progress: " + Math.round((i / sorted.length) * 100) + "%");
    const p1 = lines[c.pos1];
    const p2 = lines[c.pos2];
    // Full validation: ensure rectangle (box) is fully inside polygon using edge-intersection test
    if (rectangleFullyInPolygon(lines, p1, p2)) {
        found = c;
        break;
    }
}

if (!found) {
    console.log('No valid area found');
} else {
    console.log("part2: (" + found.pos1 + ": " + lines[found.pos1] + "), (" + found.pos2 + ": " + lines[found.pos2] + "), area: " + found.area)
}
function calculateArea(pos1, pos2) {
    let distanceX = Math.abs(pos1[0] - pos2[0]) + 1
    let distanceY = Math.abs(pos1[1] - pos2[1]) + 1
    return distanceX * distanceY
}
