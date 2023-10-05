import {createLine} from "./lineHelper";
import * as THREE from "three";

const line_intersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    let ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom === 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    }
}

export const createSchemeLines = (studio) => {
    const points = [
        [0, 0, 1],
        [11, 0, 0],
        [5, 0, 5],
        [3, 0, 5],
        [10, 0, -5],
    ]

    for (let i = 1; i < points.length; ++i) {
        const l = createLine({ p0: points[i - 1], p1: points[i] })
        studio.addToScene(l)
    }

    const lines = []
    for (let i = 1; i < points.length; ++i) {
        const data = {
            p0: new THREE.Vector3().fromArray(points[i - 1]),
            p1: new THREE.Vector3().fromArray(points[i]),
        }
        lines.push(data)
    }

    const addLabel = (i, j) => {
        const intercept = line_intersect(
            lines[i].p0.x, lines[i].p0.z,
            lines[i].p1.x, lines[i].p1.z,
            lines[j].p0.x, lines[j].p0.z,
            lines[j].p1.x, lines[j].p1.z,
        )
        console.log(intercept)
        if (!intercept || !intercept.seg1) {
            return
        }
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(.2, .2, .2),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        )
        mesh.position.x = intercept.x
        mesh.position.z = intercept.y
        studio.addToScene(mesh)
    }

    let i = 0, j = 1

    const iterate = () => {
        console.log(i, j)
        ++j
        if (!lines[j]) {
            ++i
            j = i + 1
            if (!lines[i] || !lines[j]) {
                return
            }
        }
        addLabel(i, j)
        setTimeout(() => {
            //debugger;
            iterate()
        }, 100)
    }
    iterate()

    for (let i = 0; i < lines.length; ++i) {
        for (let j = i; j < lines.length; ++j) {

        }
    }

    return lines
}
