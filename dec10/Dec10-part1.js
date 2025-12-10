const { init } = require('z3-solver');


const fs = require('fs');
const path = require('path');
async () => {
    const {
        Z3, // Low-level C-like API
        Context, // High-level Z3Py-like API
    } = await init();
}
const inputPath = path.join(__dirname, 'dec10input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.split(/[\r\n]+/)

const tStart = Date.now();

let machines = []

for (let idx in lines) {
    let line = lines[idx]
    let target = line.substring(1, line.indexOf("]")).split('').map(x => x == '#')

    let buttons = line.substring(line.indexOf("]") + 2, line.indexOf("{") - 1).split(" ").map(x => x.slice(1, -1).split(",").map(Number))

    let joltages = line.substring(line.indexOf("{") + 1, line.indexOf("}")).split(",").map(Number)

    machines.push({ target, buttons, joltages })

}
function trySolution(machine, target, start, depth, state) {
    if (depth == target)
        return state.every((v, i) => v === machine.target[i]);

    for (let i = start; i <= machine.buttons.length - (target - depth); i++) {
        toggleLights(machine.buttons[i], state);
        if (trySolution(machine, target, i + 1, depth + 1, state))
            return true;
        toggleLights(machine.buttons[i], state);
    }
    return false;
}
function toggleLights(lights, state) {
    for (let idx of lights.filter(i => i < state.length))
        state[idx] = !state[idx];
}
let result = 0;
machines.forEach(machine => {
    for (let pressCount = 0; pressCount <= machine.buttons.length; pressCount++) {
        if (trySolution(machine, pressCount, 0, 0, new Array(machine.target.length).fill(false))) {
            result += pressCount
            break
        }
    }
})
console.log("part1: " + result)
