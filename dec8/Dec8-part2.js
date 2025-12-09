const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'dec8input.txt');

const rawInput = fs.readFileSync(inputPath, 'utf8');

const lines = rawInput.replace(/\r/g, '').split("\n");


let allConnections = []

function distance3D(a, b) {
    if (!a || !b) throw new TypeError('Two position objects required');
    const { x: ax, y: ay, z: az } = a;
    const { x: bx, y: by, z: bz } = b;
    if ([ax, ay, az, bx, by, bz].some(v => typeof v !== 'number')) {
        throw new TypeError('Positions must have numeric x, y, z properties');
    }
    const dx = ax - bx;
    const dy = ay - by;
    const dz = az - bz;
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
let positions = []
for (let posIdx in lines) {
    let pos = lines[posIdx]
    let splitPos = pos.split(",")
    positions.push({ x: parseInt(splitPos[0]), y: parseInt(splitPos[1]), z: parseInt(splitPos[2]), index: posIdx })
}

for (let pos1idx in positions) {
    for (let pos2idx = parseInt(pos1idx) + 1; pos2idx < positions.length; pos2idx++) {
        allConnections.push({
            from: positions[pos1idx], to: positions[pos2idx], distance: distance3D(positions[pos1idx], positions[pos2idx])
        })
    }
}
allConnections = allConnections.sort((a, b) => a.distance - b.distance)
class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = Array(n).fill(1);
    }

    find(a) {
        while (this.parent[a] !== a) {
            this.parent[a] = this.parent[this.parent[a]]; // path compression (halving)
            a = this.parent[a];
        }
        return a;
    }

    union(a, b) {
        const rootA = this.find(a);
        const rootB = this.find(b);

        if (rootA === rootB) return false;

        // union by rank
        if (this.rank[rootA] < this.rank[rootB]) {
            this.parent[rootA] = rootB;
        } else if (this.rank[rootA] > this.rank[rootB]) {
            this.parent[rootB] = rootA;
        } else {
            this.parent[rootB] = rootA;
            this.rank[rootA]++;
        }

        return true;
    }
}
const uf = new UnionFind(lines.length);


for (let connectionIdx in allConnections) {
    let connection = allConnections[connectionIdx]
    uf.union(connection.from.index, connection.to.index)

    const size_ids = new Set(lines.map((_, idx) => uf.find(idx)));
    if (size_ids.size == 1) {
        console.log("Part 2 result: " + connection.from.x * connection.to.x)
        break
    }
}