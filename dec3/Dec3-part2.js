const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec3input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split("\n");

let result = 0;

for (let line of lines) {
    let currentIndex = 0;
    numberAtIndex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let lastIndex = -1
    for (let i = 12; i >= 0; i--) {
        lastIndex = findNumber(line, i, numberAtIndex, currentIndex++, lastIndex)
    }

    let resultStr = ""
    numberAtIndex.forEach(element => {
        resultStr += element.toString()
    });
    result += parseInt(resultStr)
}

function findNumber(line, minLength, numberAtIndex, currentIndex, lastIndex) {
    let newLastIndex = 0;
    for (let i = line.length - minLength; i > lastIndex; i -= 1) {
        let thisNumber = line[i]
        if (parseInt(thisNumber) >= numberAtIndex[currentIndex]) {
            newLastIndex = i
            numberAtIndex[currentIndex] = parseInt(thisNumber)
        }
    }
    return newLastIndex

}

console.log("part 2: " + result);