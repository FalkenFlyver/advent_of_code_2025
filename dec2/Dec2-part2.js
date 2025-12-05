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
    let MaxTestLength = Math.ceil(numStr.length / 2)
    let noMatch = true;
    for (let testLengthOf = 1; testLengthOf <= MaxTestLength; testLengthOf++) {
        for (k = 0; k <= numStr.length / testLengthOf; k++) {
            try {
                if (numStr.substring(k * testLengthOf + testLengthOf, k * testLengthOf + testLengthOf + testLengthOf) == "") break;
                if (numStr.substring(k * testLengthOf, k * testLengthOf + testLengthOf) == numStr.substring(k * testLengthOf + testLengthOf, k * testLengthOf + testLengthOf + testLengthOf)) { noMatch = false; continue; }
                else { noMatch = true; break; }
            } catch (e) { }
        }
        if (noMatch == false) { console.log(num); return num; }
    }
    return 0;
}
console.log("part 2 result: " + result)