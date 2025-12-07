const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec6input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split("\n");

let problems = []
let operatorsList = [];
let columnLengths = []
let maxColumns = 0;
let lineCount = 0;
for (let line of lines) {
    lineCount++

    if (lineCount == lines.length) {
        //Doing these later
        break;
    }

    let colCount = 0;
    let number = { column: 0, value: '' }
    for (let tokenIdx in line) {
        let token = line[tokenIdx];
        if (token == ' ' &&
            !Number.isNaN(parseInt(number.value)) &&
            (tokenIdx == line.length - 1
                || line[parseInt(tokenIdx) + 1].match(/\d/))
        ) {
            colCount++
            maxColumns = colCount + 1
            problems.push(number)
            number = { column: colCount, value: '' }

            continue;
        }
        number.value += token

    }
    problems.push(number)
}
for (let i = 0; i < maxColumns; i++) {

    columnLengths.push({ column: i, lengthx: problems.filter(x => x.column == i).map(x => x.value.trim().length).sort((a, b) => b - a)[0] })
}
problems = []
lineCount = 0;
for (let line of lines) {
    lineCount++
    let colCount = 0;

    if (lineCount == lines.length) {
        colCount = 0;
        let parts = line.trim().split(" ")
        for (let p in parts) {
            parts[p] = parts[p].trim()
            if (parts[p] == '') continue;
            operatorsList.push({ operator: parts[p], column: colCount++ })
        }
        break;
    }
    let number = { column: 0, value: '' }
    for (let tokenIdx in line) {
        let token = line[tokenIdx];
        if (token == ' ' && number.value.length == columnLengths[colCount].lengthx
        ) {
            colCount++
            problems.push(number)
            number = { column: colCount, value: '' }
            continue;
        }
        number.value += token

    }
    problems.push(number)
}


console.log(problems);

let result = 0;
for (let op in operatorsList) {
    let currentProblems = problems.filter(x => x.column == op)
    if (operatorsList[op].operator === '+') {
        let sum = 0;
        let columnLength = columnLengths.filter(x => x.column == op)[0]
        for (let i = columnLength.lengthx - 1; i >= 0; i--) {
            let element = currentProblems.map(x => x.value[i]).join('');
            sum += parseInt(element);
        }
        result += sum;
    }
    if (operatorsList[op].operator === '*') {
        let sum = 0;
        let columnLength = columnLengths.filter(x => x.column == op)[0]
        for (let i = columnLength.lengthx - 1; i >= 0; i--) {
            let element = currentProblems.map(x => x.value[i]).join('');
            if (sum == 0) sum = parseInt(element)
            else
                sum *= parseInt(element);
        }
        result += sum;
    }

}
console.log("part 1 result: " + result);