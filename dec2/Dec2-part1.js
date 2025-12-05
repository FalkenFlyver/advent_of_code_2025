const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec2input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split(",");

let result = 0;
for (var range of lines) {
    var parts = range.split("-");
    for (var i = parseInt(parts[0]); i <= parseInt(parts[1]); i++) {
        result += resultIfRepeatingSequence(i);
    }
}
function resultIfRepeatingSequence(num) {
    let numStr = num.toString();
    if (numStr.substring(0, numStr.length / 2) === numStr.substring(numStr.length / 2)) {
        return num
    }
    return 0;
}

console.log("part 1 result: " + result)