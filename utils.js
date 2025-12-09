

// Axis-Aligned Bounding Box helpers
// computeAABB accepts a variety of vertex list shapes:
// - Array of points: [[x,y], [x,y], ...]
// - Array of objects: [{x:.., y:..}, ...]
// - Flat numeric array: [x1,y1,x2,y2,...]
const computeAABB = (vertices) => {
    if (!vertices || vertices.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // flat numeric array: [x,y,x,y,...]
    if (typeof vertices[0] === 'number') {
        for (let i = 0; i < vertices.length; i += 2) {
            const x = Number(vertices[i]);
            const y = Number(vertices[i + 1]);
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }
        return { minX, minY, maxX, maxY };
    }

    // array of arrays or array of objects
    for (const p of vertices) {
        let x, y;
        if (Array.isArray(p)) {
            x = Number(p[0]);
            y = Number(p[1]);
        } else if (p && typeof p === 'object' && 'x' in p && 'y' in p) {
            x = Number(p.x);
            y = Number(p.y);
        } else {
            // skip malformed entries
            continue;
        }

        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }

    // if still infinite (no valid points), return zeros
    if (minX === Infinity) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    return { minX, minY, maxX, maxY };
}

const pointInAABB = (box, point) => {
    const x = Number(point[0]);
    const y = Number(point[1]);
    return x >= box.minX && x <= box.maxX && y >= box.minY && y <= box.maxY;
}

const bothPointsInAABB = (box, p1, p2) => pointInAABB(box, p1) && pointInAABB(box, p2);

// Ray-casting algorithm for point-in-polygon (works for non-self-intersecting polygons)
const pointInPolygon = (polygon, point) => {
    const x = Number(point[0]);
    const y = Number(point[1]);
    let inside = false;

    // Helper: check if point is on segment [a,b]
    const onSegment = (a, b, p) => {
        const ax = Number(a[0]), ay = Number(a[1]);
        const bx = Number(b[0]), by = Number(b[1]);
        const px = Number(p[0]), py = Number(p[1]);

        // Compute cross product to check collinearity
        const cross = (bx - ax) * (py - ay) - (by - ay) * (px - ax);
        if (cross !== 0) return false;

        // Check if p is within bounding box of a and b
        const minX = Math.min(ax, bx), maxX = Math.max(ax, bx);
        const minY = Math.min(ay, by), maxY = Math.max(ay, by);
        return px >= minX && px <= maxX && py >= minY && py <= maxY;
    }

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = Number(polygon[i][0]), yi = Number(polygon[i][1]);
        const xj = Number(polygon[j][0]), yj = Number(polygon[j][1]);

        // If point lies exactly on the edge, treat as inside
        if (onSegment(polygon[j], polygon[i], [x, y])) return true;

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi + 0.0) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

const bothPointsInPolygon = (polygon, p1, p2) => pointInPolygon(polygon, p1) && pointInPolygon(polygon, p2);

// Check that every integer grid point in the axis-aligned rectangle
// defined by p1 and p2 is inside the polygon (inclusive of edges).
const allPointsInPolygonArea = (polygon, p1, p2) => {
    const x1 = Number(p1[0]), y1 = Number(p1[1]);
    const x2 = Number(p2[0]), y2 = Number(p2[1]);
    const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);

    // Quick fail-fast checks: corners and center
    const corners = [[minX, minY], [minX, maxY], [maxX, minY], [maxX, maxY]];
    for (const c of corners) if (!pointInPolygon(polygon, c)) return false;

    const center = [Math.floor((minX + maxX) / 2), Math.floor((minY + maxY) / 2)];
    if (!pointInPolygon(polygon, center)) return false;

    // Check perimeter (likely to find an exterior point quickly)
    for (let x = minX; x <= maxX; x++) {
        if (!pointInPolygon(polygon, [x, minY])) return false;
        if (!pointInPolygon(polygon, [x, maxY])) return false;
    }
    for (let y = minY + 1; y <= maxY - 1; y++) {
        if (!pointInPolygon(polygon, [minX, y])) return false;
        if (!pointInPolygon(polygon, [maxX, y])) return false;
    }

    // Fall back to full interior scan with early exit
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if (!pointInPolygon(polygon, [x, y])) return false;
        }
    }

    return true;
}



// Segment intersection utility
const segIntersects = (a, b, c, d) => {
    const ax = Number(a[0]), ay = Number(a[1]);
    const bx = Number(b[0]), by = Number(b[1]);
    const cx = Number(c[0]), cy = Number(c[1]);
    const dx = Number(d[0]), dy = Number(d[1]);

    const orient = (p, q, r) => {
        const px = Number(p[0]), py = Number(p[1]);
        const qx = Number(q[0]), qy = Number(q[1]);
        const rx = Number(r[0]), ry = Number(r[1]);
        return (qx - px) * (ry - py) - (qy - py) * (rx - px);
    }

    const onSeg = (p, q, r) => {
        const px = Number(p[0]), py = Number(p[1]);
        const qx = Number(q[0]), qy = Number(q[1]);
        const rx = Number(r[0]), ry = Number(r[1]);
        return qx >= Math.min(px, rx) && qx <= Math.max(px, rx) && qy >= Math.min(py, ry) && qy <= Math.max(py, ry);
    }

    const o1 = orient(a, b, c);
    const o2 = orient(a, b, d);
    const o3 = orient(c, d, a);
    const o4 = orient(c, d, b);

    // Ignore collinear overlapping as intersection (treat touching/collinear as non-intersecting)
    // Proper intersection only when orientations are strictly opposite
    const proper = (x, y) => (x > 0 && y < 0) || (x < 0 && y > 0);
    if (proper(o1, o2) && proper(o3, o4)) return true;
    // otherwise no proper intersection; treat collinear/on-segment as non-intersecting
    return false;
}

// Determine whether the axis-aligned rectangle defined by p1 and p2 is fully inside the polygon.
// Algorithm:
// 1) Verify all four rectangle corners are inside the polygon (boundary counts as inside).
// 2) Verify no polygon edge intersects any rectangle edge. If there is any intersection, the
//    polygon crosses the rectangle boundary and the rectangle is not fully contained.
// If both checks pass, the rectangle is considered fully inside the polygon.
const rectangleFullyInPolygon = (polygon, p1, p2) => {
    const x1 = Number(p1[0]), y1 = Number(p1[1]);
    const x2 = Number(p2[0]), y2 = Number(p2[1]);
    const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);

    const corners = [[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY]];

    // Check corners inside (boundary counts)
    for (const c of corners) if (!pointInPolygon(polygon, c)) return false;

    // Build rectangle edges
    const rectEdges = [
        [corners[0], corners[1]],
        [corners[1], corners[2]],
        [corners[2], corners[3]],
        [corners[3], corners[0]]
    ];

    // Check polygon edges for intersection with any rectangle edge
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const pa = polygon[j];
        const pb = polygon[i];
        for (const [r1, r2] of rectEdges) {
            if (segIntersects(pa, pb, r1, r2)) return false;
        }
    }

    return true;
}

module.exports = {
    computeAABB, pointInAABB, bothPointsInAABB, pointInPolygon, bothPointsInPolygon, allPointsInPolygonArea, rectangleFullyInPolygon
};