const { init } = require('z3-solver');


const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec10input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.split(/[\r\n]+/).filter(Boolean)

const tStart = Date.now();

let machines = []

for (let idx in lines) {
    let line = lines[idx]
    let target = line.substring(1, line.indexOf("]")).split('').map(x => x == '#')

    let buttons = line.substring(line.indexOf("]") + 2, line.indexOf("{") - 1).split(" ").map(x => x.slice(1, -1).split(",").map(Number))

    let joltages = line.substring(line.indexOf("{") + 1, line.indexOf("}")).split(",").map(Number)

    machines.push({ target, buttons, joltages })

}

let result = 0;

async function main() {
    // Initialize Z3 and get the high-level `Context` constructor.
    // `init()` loads the z3 engine and returns helper classes.
    const { Context } = await init();

    // Iterate over each machine parsed from the input.
    for (const machine of machines) {
        // Create a fresh Z3 context for this solve. Contexts isolate
        // expressions, solvers and models from other runs.
        const ctx = new Context("main");

        // Create an Optimize object (an optimization-capable solver).
        // We'll add constraints to `opt` and then ask it to minimize an objective.
        const opt = new ctx.Optimize();

        // Create one integer variable per physical button: p0, p1, ...
        // Each `pX` represents how many times that button is pressed.
        const presses = new Array(machine.buttons.length).fill(0).map((_, i) => ctx.Int.const(i))

        // Constrain each press variable to be >= 0 (no negative presses).
        for (const press of presses) {
            // ctx.GE(...) builds a "greater-or-equal" expression in this context;
            // ctx.Int.val(0) is the integer literal 0.
            opt.add(ctx.GE(press, ctx.Int.val(0)));
        }

        // For each light position (index `i`), constrain the sum of presses
        // from buttons that affect that light to equal the required jolt.
        for (let i = 0; i < machine.joltages.length; i++) {
            // Collect variables for buttons that toggle light `i`.
            const affecting = presses.filter((_, j) => machine.buttons[j].indexOf(i) !== -1);
            if (affecting.length > 0) {
                // If only one variable affects this light, use it directly;
                // otherwise create a sum expression using ctx.Sum(...).
                const sum = affecting.length == 1 ? affecting[0] : ctx.Sum(...affecting);
                // Constrain the sum to equal the target jolt for this light.
                opt.add(ctx.Eq(sum, ctx.Int.val(machine.joltages[i])));
            }
        }

        // Add an objective: minimize the total number of presses.
        // If there's a single press variable, minimize it directly;
        // otherwise minimize the sum of all press variables.
        opt.minimize(presses.length == 1 ? presses[0] : ctx.Sum(...presses));

        // Ask Z3/Optimize to solve the constraints and satisfy the objective.
        // This is asynchronous so we `await` the result.
        const sat = await opt.check();
        // `opt.check()` returns 'sat' if a satisfying model was found.
        if (sat !== 'sat') {
            // No solution for this machine — skip to the next machine.
            continue;
        }

        // Retrieve the model (the assignments Z3 found for the variables).
        const model = opt.model();
        // Extract each press variable's value from the model and add it
        // to the aggregated `result`. `model.eval(p, true)` evaluates `p`.
        presses.forEach(p => {
            const v = model.eval(p, true);
            // `v.value()` returns a BigInt-like numeric object; convert to Number.
            result += Number(v.value());
        });
    }

    console.log("part2: " + result)
    const tEnd = Date.now();
    const elapsedMs = tEnd - tStart;
    console.log('Time to find result: ' + elapsedMs + ' ms (' + (elapsedMs / 1000).toFixed(3) + ' s)');
}

main();

