const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec5input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

let lines = rawInput.replace(/\r/g, '').split("\n");

// start timer (milliseconds)
const startTime = Date.now();

lines = lines.sort((a, b) => {
    let aStart = parseInt(a.split("-")[0])
    let bStart = parseInt(b.split("-")[0])
    return aStart - bStart
})

let freshRanges = []
let result = 0;
for (let line of lines) {
    if (line.indexOf("-") !== -1) {
        let range = line.split("-")
        let currentStart = parseInt(range[0])
        let currentEnd = parseInt(range[1])
        freshRanges.push({ start: currentStart, end: currentEnd })
    }

}
function mergeRangesWithOverlap() {
    //Sort by start then end
    freshRanges = freshRanges.sort((a, b) => a.start - b.start || a.end - b.end)
    for (let range of freshRanges) {
        for (let otherRange of freshRanges) {
            //If self
            if (range === otherRange || otherRange.ignore) continue;
            //If fully engulfed
            if (range.start < otherRange.start && range.end > otherRange.end) {
                otherRange.ignore = true
            }
            //If start is inside next range
            if (range.end <= otherRange.end && range.end >= otherRange.start) {
                if (range.start > otherRange.start) {
                    range.ignore = true
                }
                range.originalEnd = range.end
                range.end = otherRange.start - 1
            }
        }

    }
}

function countHowManyInRange() {
    for (let range of freshRanges) {
        if (range.ignore) continue;
        result += range.end - range.start + 1
    }
}
mergeRangesWithOverlap()
freshRanges = freshRanges.sort((a, b) => a.start - b.start)

for (let range in freshRanges) {
    try {
        if (!freshRanges[range].ignore && freshRanges[range].start > freshRanges[range].end) {
            console.log("problem  start > end by: " + (freshRanges[range].start - freshRanges[range].end))
            freshRanges[range].ignore = true
        }
        if (freshRanges[range].end > freshRanges[range + 1].start) {
            console.log("Overlap detected")
        }
        if (!freshRanges[range].ignore && freshRanges[range].start < freshRanges[range - 1].end) {
            console.log("Overlap detected")
        }
    }
    catch (e) { }
}

countHowManyInRange()
console.error("Part 2 result: " + result);
// end timer and report elapsed milliseconds
const endTime = Date.now();
console.log(`Elapsed time: ${endTime - startTime} ms`);
function testIfInRange(number) {
    for (let range of freshRanges) {
        if (number >= range.start && number <= range.end) {
            return true
        }
    }
    return false
}
if (result <= 312540809992679 || result <= 326137758239804)
    console.log("TOo low!!")
if (result >= 335808501195459)
    console.log("TOo high!!")

// 312540809992679 -- too low