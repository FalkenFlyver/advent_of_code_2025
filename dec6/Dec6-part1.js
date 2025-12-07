const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec6input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split("\n");

let problems = []
let operatorsList = [];

for (let line of lines) {
    let colCount = 0;
    let parts = line.trim().split(" ")
    for (let p in parts) {
        parts[p] = parts[p].trim()
        if (parts[p] == '') continue;
        if (!Number.isNaN(parseInt(parts[p]))) {
            problems.push({ number: parseInt(parts[p]), column: colCount })
        }
        else
            operatorsList.push({ operator: parts[p], column: colCount })
        colCount++;

    }
}
let result = 0;
for (let op in operatorsList) {
    if (operatorsList[op].operator === '+') {
        let sum = 0;
        problems.filter(x => x.column == op).forEach(element => {
            sum += element.number;
        });
        result += sum;
    }
    if (operatorsList[op].operator === '*') {
        let sum = 0;
        problems.filter(x => x.column == op).forEach(element => {
            if (sum == 0) sum = element.number
            else sum *= element.number;
        });
        result += sum;
    }

}
console.log("part 1 result: " + result);