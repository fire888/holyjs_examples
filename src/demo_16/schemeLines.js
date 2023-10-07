import { createLineFromVectors } from "./lineHelper";
import * as THREE from "three";
import { M } from './M'

let id = 0
const getID = () => ++id
let studio

const addBox = (v, color = 0xFF0000) => {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(.05, .05, .05),
        new THREE.MeshBasicMaterial({ color })
    )
    mesh.position.copy(v)
    studio.addToScene(mesh)
}

const getInterceptLines = (l1, l2) => {
    const intercept = M.line_intersect(
        l1.p0.x, l1.p0.z,
        l1.p1.x, l1.p1.z,
        l2.p0.x, l2.p0.z,
        l2.p1.x, l2.p1.z,
    )
    if (!intercept || !intercept.seg1) {
        return
    }
    return intercept
}

const createLines = () => {
    const points = [
        [0, 0, 0],
        [11, 0, -2],
        [5, 0, 5],
        [3, 0, 5],
        [10, 0, -5],
        [5, 0, -3],
        [2, 0, 3],
        [15, 0, 3],
    ]
    const lines = []
    for (let i = 1; i < points.length; ++i) {
        const p0 = new THREE.Vector3().fromArray(points[i - 1])
        const p1 = new THREE.Vector3().fromArray(points[i])
        const dist = p0.distanceTo(p1)
        const dir = new THREE.Vector3().copy(p1).sub(p0).normalize()
        const angle = M.angleFromCoords(dir.x, dir.z)

        const w = .5
        const data = {
            id: getID(),
            type: 'corridor',
            w,
            axis: { p0, p1, dist, dir, angle }
        }

        const lx = Math.cos(angle - Math.PI / 2) * w
        const lz = Math.sin(angle - Math.PI / 2) * w
        const lP0 = new THREE.Vector3(lx, 0, lz).add(p0)
        const lP1 = new THREE.Vector3(lx, 0, lz).add(p1)

        const rx = Math.cos(angle + Math.PI / 2) * w
        const rz = Math.sin(angle + Math.PI / 2) * w
        const rP0 = new THREE.Vector3(rx, 0, rz).add(p0)
        const rP1 = new THREE.Vector3(rx, 0, rz).add(p1)

        data.rightLine = { p0: rP0, p1: rP1 }
        data.leftLine = { p0: lP0, p1: lP1 }

        lines.push(data)
    }
    for (let i = 0; i < lines.length; ++i) {
        if (lines[i - 1]) {
            lines[i].prevId = lines[i - 1].id
        } else {
            lines[i].prevId = null
        }
        if (lines[i + 1]) {
            lines[i].nextId = lines[i + 1].id
        } else {
            lines[i].nextId = null
        }
    }


    return lines
}


const getConnectionsWithNears = lines => {
    for (let i = 1; i < lines.length; ++i) {
        const interceptL = M.line_intersect(
            lines[i - 1].leftLine.p0.x,
            lines[i - 1].leftLine.p0.z,
            lines[i - 1].leftLine.p1.x,
            lines[i - 1].leftLine.p1.z,
            lines[i].leftLine.p0.x,
            lines[i].leftLine.p0.z,
            lines[i].leftLine.p1.x,
            lines[i].leftLine.p1.z,
        )
        if (interceptL && interceptL.seg1) {
            lines[i - 1].leftLine.p1.x = interceptL.x
            lines[i - 1].leftLine.p1.z = interceptL.y
            lines[i].leftLine.p0.x = interceptL.x
            lines[i].leftLine.p0.z = interceptL.y
        }
        const interceptR = M.line_intersect(
            lines[i - 1].rightLine.p0.x,
            lines[i - 1].rightLine.p0.z,
            lines[i - 1].rightLine.p1.x,
            lines[i - 1].rightLine.p1.z,
            lines[i].rightLine.p0.x,
            lines[i].rightLine.p0.z,
            lines[i].rightLine.p1.x,
            lines[i].rightLine.p1.z,
        )
        if (interceptR && interceptR.seg1) {
            lines[i - 1].rightLine.p1.x = interceptR.x
            lines[i - 1].rightLine.p1.z = interceptR.y
            lines[i].rightLine.p0.x = interceptR.x
            lines[i].rightLine.p0.z = interceptR.y
        }
    }
    return lines
}

const addCorners = lines => {
    const corners = []
    for (let i = 1; i < lines.length; ++i) {
        if (
            (lines[i - 1].leftLine.p1.x !== lines[i].leftLine.p0.x) ||
            (lines[i - 1].leftLine.p1.z !== lines[i].leftLine.p0.z)
        ) {
            corners.push({
                id: getID(),
                type: 'corner',
                p0: lines[i - 1].leftLine.p1,
                p1: lines[i].leftLine.p0,
                p2: lines[i - 1].rightLine.p1,
                dir: 'p2_p1_p0',
                dist: lines[i].leftLine.p0.distanceTo(lines[i - 1].leftLine.p1)
            })
        }
        if (
            (lines[i - 1].rightLine.p1.x !== lines[i].rightLine.p0.x) ||
            (lines[i - 1].rightLine.p1.z !== lines[i].rightLine.p0.z)
        ) {
            corners.push({
                id: getID(),
                type: 'corner',
                p0: lines[i - 1].rightLine.p1,
                p1: lines[i].rightLine.p0,
                p2: lines[i - 1].leftLine.p1,
                dir: 'p0_p1_p2'
            })
        }
    }
    lines.push(...corners)
    return lines
}

const addCrosses = items => {
    let n = .1
    const drawLines = d => {
        n +=.1
        const l = createLineFromVectors(d.axis.p0, d.axis.p1, 0xFF0000)
        l.position.y = n
        const l1 = createLineFromVectors(d.leftLine.p0, d.leftLine.p1, 0xFFFF00)
        l1.position.y = n
        const l2 = createLineFromVectors(d.rightLine.p0, d.rightLine.p1, 0x00FFFF)
        l2.position.y = n
        studio.addToScene(l)
        studio.addToScene(l1)
        studio.addToScene(l2)
    }

    return new Promise(res => {
        const oldCorridors = items.filter(n => n.type === 'corridor')
        const corners = items.filter(n => n.type === 'corner')
        const crosses = []
        const newCorridors = []

        const checkIntercept = corridors => {
            return new Promise(res => {
                const checkIntercept = (i, j) => {
                    if (
                        corridors[i].nextId === corridors[j].id ||
                        corridors[j].nextId === corridors[i].id ||
                        corridors[i].prevId === corridors[j].id ||
                        corridors[j].prevId === corridors[i].id
                    ) {
                        return false
                    }
                    const intercept = getInterceptLines(corridors[i].axis, corridors[j].axis)
                    if (!intercept || !intercept.seg1 || !intercept.seg2) {
                        return false
                    }
                    return {
                        x: intercept.x,
                        z: intercept.y,
                        idCorridorCurrent: corridors[i].id,
                        idCorridorWith: corridors[j].id
                    }
                }

                let i = 0, j = 0
                const iterate = () => {
                    ++j
                    if (!corridors[j]) {
                        ++i
                        j = i + 1
                        if (!corridors[i] || !corridors[j]) {
                            return void res(null)
                        }
                    }
                    const intercept = checkIntercept(i, j)
                    if (intercept) {
                        return void res(intercept)
                    }
                    setTimeout(() => {
                        iterate()
                    }, 1)
                }
                iterate()
            })
        }


        const createCrossByIntercept = (crossData, oldCorridors) => {
            return new Promise(res => {
                const corridorCurrent = oldCorridors.filter(n => n.id === crossData.idCorridorCurrent)[0]
                const corridorWith = oldCorridors.filter(n => n.id === crossData.idCorridorWith)[0]
                //const newCorridors = oldCorridors.filter(n => n.id !== crossData.idCorridorCurrent && n.id !== crossData.idCorridorWith)
                let newCorridors

                //console.log('crossData', crossData, corridorCurrent, corridorWith)

                const interceptAxis1 = M.line_intersect(
                    corridorCurrent.axis.p0.x, corridorCurrent.axis.p0.z,
                    corridorCurrent.axis.p1.x, corridorCurrent.axis.p1.z,
                    corridorWith.leftLine.p0.x, corridorWith.leftLine.p0.z,
                    corridorWith.leftLine.p1.x, corridorWith.leftLine.p1.z,
                )
                const d1 = new THREE.Vector3(interceptAxis1.x, 0, interceptAxis1.y).distanceTo(corridorCurrent.axis.p0)
                addBox(new THREE.Vector3(interceptAxis1.x, 0, interceptAxis1.y), 0x0000ff)

                const interceptAxis2 = M.line_intersect(
                    corridorCurrent.axis.p0.x, corridorCurrent.axis.p0.z,
                    corridorCurrent.axis.p1.x, corridorCurrent.axis.p1.z,
                    corridorWith.rightLine.p0.x, corridorWith.rightLine.p0.z,
                    corridorWith.rightLine.p1.x, corridorWith.rightLine.p1.z,
                )
                addBox(new THREE.Vector3(interceptAxis2.x, 0, interceptAxis2.y), 0x0000ff)
                const d2 = new THREE.Vector3(interceptAxis2.x, 0, interceptAxis2.y).distanceTo(corridorCurrent.axis.p0)

                if (d1 < d2) {
                    const p0 = M.line_intersect(
                        corridorCurrent.leftLine.p0.x, corridorCurrent.leftLine.p0.z,
                        corridorCurrent.leftLine.p1.x, corridorCurrent.leftLine.p1.z,
                        corridorWith.leftLine.p0.x, corridorWith.leftLine.p0.z,
                        corridorWith.leftLine.p1.x, corridorWith.leftLine.p1.z,
                    )
                    const p1 = M.line_intersect(
                        corridorCurrent.rightLine.p0.x, corridorCurrent.rightLine.p0.z,
                        corridorCurrent.rightLine.p1.x, corridorCurrent.rightLine.p1.z,
                        corridorWith.leftLine.p0.x, corridorWith.leftLine.p0.z,
                        corridorWith.leftLine.p1.x, corridorWith.leftLine.p1.z,
                    )
                    const p2 = M.line_intersect(
                        corridorCurrent.rightLine.p0.x, corridorCurrent.rightLine.p0.z,
                        corridorCurrent.rightLine.p1.x, corridorCurrent.rightLine.p1.z,
                        corridorWith.rightLine.p0.x, corridorWith.rightLine.p0.z,
                        corridorWith.rightLine.p1.x, corridorWith.rightLine.p1.z,
                    )
                    const p3 = M.line_intersect(
                        corridorCurrent.leftLine.p0.x, corridorCurrent.leftLine.p0.z,
                        corridorCurrent.leftLine.p1.x, corridorCurrent.leftLine.p1.z,
                        corridorWith.rightLine.p0.x, corridorWith.rightLine.p0.z,
                        corridorWith.rightLine.p1.x, corridorWith.rightLine.p1.z,
                    )

                    const c2Id = getID()
                    const c1 = {
                        id: getID(),
                        prevId: corridorCurrent.prevId,
                        nextId: c2Id,
                        type: 'corridor',
                        axis: { p0: corridorCurrent.axis.p0, p1: new THREE.Vector3(interceptAxis1.x, 0, interceptAxis1.y) },
                        leftLine: { p0: corridorCurrent.leftLine.p0, p1: new THREE.Vector3(p0.x, 0, p0.y) },
                        rightLine: { p0: corridorCurrent.rightLine.p0, p1: new THREE.Vector3(p1.x, 0, p1.y) },
                    }
                    const corridorPrev = oldCorridors.filter(c => c.id === corridorCurrent.prevId)
                    if (corridorPrev && corridorPrev.length === 1) {
                        corridorPrev.nextId = c1.id
                    }
                    const c2 = {
                        id: c2Id,
                        prevId: c1.id,
                        nextId: corridorCurrent.nextId,
                        type: 'corridor',
                        axis: { p0: new THREE.Vector3(interceptAxis2.x, 0, interceptAxis2.y), p1: corridorCurrent.axis.p1 },
                        leftLine: { p0: new THREE.Vector3(p3.x, 0, p3.y), p1: corridorCurrent.leftLine.p1 },
                        rightLine: { p0: new THREE.Vector3(p2.x, 0, p2.y), p1: corridorCurrent.rightLine.p1 },
                    }
                    const corridorNext = oldCorridors.filter(c => c.id === corridorCurrent.nextId)
                    if (corridorNext && corridorNext.length === 1) {
                        corridorNext.prevId = c2.id
                    }

                    const interceptAxis3 = M.line_intersect(
                        corridorWith.axis.p0.x, corridorWith.axis.p0.z,
                        corridorWith.axis.p1.x, corridorWith.axis.p1.z,
                        corridorCurrent.rightLine.p0.x, corridorCurrent.rightLine.p0.z,
                        corridorCurrent.rightLine.p1.x, corridorCurrent.rightLine.p1.z,
                    )
                    addBox(new THREE.Vector3(interceptAxis3.x, 0, interceptAxis3.y), 0xFFFFFF)

                    const interceptAxis4 = M.line_intersect(
                        corridorWith.axis.p0.x, corridorWith.axis.p0.z,
                        corridorWith.axis.p1.x, corridorWith.axis.p1.z,
                        corridorCurrent.leftLine.p0.x, corridorCurrent.leftLine.p0.z,
                        corridorCurrent.leftLine.p1.x, corridorCurrent.leftLine.p1.z,
                    )
                    addBox(new THREE.Vector3(interceptAxis4.x, 0, interceptAxis4.y), 0xFF00ff)


                    const c4Id = getID()
                    const c3 = {
                        id: getID(),
                        nextId: c4Id,
                        prevId: corridorWith.prevId,
                        type: 'corridor',
                        axis: { p0: corridorWith.axis.p0, p1: new THREE.Vector3(interceptAxis3.x, 0, interceptAxis3.y) },
                        leftLine: { p0: corridorWith.leftLine.p0, p1: new THREE.Vector3(p1.x, 0, p1.y) },
                        rightLine: { p0: corridorWith.rightLine.p0, p1: new THREE.Vector3(p2.x, 0, p2.y) },
                    }
                    const prevElm = oldCorridors.filter(c => c.id === corridorWith.prevId)
                    if (prevElm && prevElm.length === 1) {
                        prevElm.nextId = c3.id
                    }

                    const c4 = {
                        id: c4Id,
                        prevId: c3.id,
                        nextId: corridorWith.nextId,
                        type: 'corridor',
                        axis: { p0: new THREE.Vector3(interceptAxis4.x, 0, interceptAxis4.y), p1: corridorWith.axis.p1 },
                        leftLine: { p0: new THREE.Vector3(p0.x, 0, p0.y), p1: corridorWith.leftLine.p1 },
                        rightLine: { p0: new THREE.Vector3(p3.x, 0, p3.y), p1: corridorWith.rightLine.p1 },
                    }

                    const nextElm = oldCorridors.filter(c => c.id === corridorWith.nextId)
                    if (nextElm && nextElm.length === 1) {
                        nextElm.prevId = c4.id
                    }
                    console.log(c1, c2, c3, c4)

                    drawLines(c1)
                    drawLines(c2)
                    drawLines(c3)
                    drawLines(c4)

                    newCorridors = []
                    for (let i = 0; i < oldCorridors.length; ++i) {
                        if (oldCorridors[i].id === corridorCurrent.id) {
                            newCorridors.push(c1, c2)
                        } else if (oldCorridors[i].id === corridorWith.id) {
                            newCorridors.push(c3, c4)
                        } else {
                            newCorridors.push(oldCorridors[i])
                        }

                    }
                    crosses.push({ id: getID(), type: 'cross', p0, p1, p2, p3 })
                    return res(newCorridors)
                } else {

                    const p0 = M.line_intersect(
                        corridorCurrent.leftLine.p0.x, corridorCurrent.leftLine.p0.z,
                        corridorCurrent.leftLine.p1.x, corridorCurrent.leftLine.p1.z,
                        corridorWith.rightLine.p0.x, corridorWith.rightLine.p0.z,
                        corridorWith.rightLine.p1.x, corridorWith.rightLine.p1.z,
                    )
                    const p1 = M.line_intersect(
                        corridorCurrent.rightLine.p0.x, corridorCurrent.rightLine.p0.z,
                        corridorCurrent.rightLine.p1.x, corridorCurrent.rightLine.p1.z,
                        corridorWith.rightLine.p0.x, corridorWith.rightLine.p0.z,
                        corridorWith.rightLine.p1.x, corridorWith.rightLine.p1.z,
                    )
                    const p2 = M.line_intersect(
                        corridorCurrent.rightLine.p0.x, corridorCurrent.rightLine.p0.z,
                        corridorCurrent.rightLine.p1.x, corridorCurrent.rightLine.p1.z,
                        corridorWith.leftLine.p0.x, corridorWith.leftLine.p0.z,
                        corridorWith.leftLine.p1.x, corridorWith.leftLine.p1.z,
                    )
                    const p3 = M.line_intersect(
                        corridorCurrent.leftLine.p0.x, corridorCurrent.leftLine.p0.z,
                        corridorCurrent.leftLine.p1.x, corridorCurrent.leftLine.p1.z,
                        corridorWith.leftLine.p0.x, corridorWith.leftLine.p0.z,
                        corridorWith.leftLine.p1.x, corridorWith.leftLine.p1.z,
                    )

                    const c2Id = getID()
                    const c1 = {
                        id: getID(),
                        prevId: corridorCurrent.prevId,
                        nextId: c2Id,
                        type: 'corridor',
                        axis: { p0: corridorCurrent.axis.p0, p1: new THREE.Vector3(interceptAxis2.x, 0, interceptAxis2.y) },
                        leftLine: { p0: corridorCurrent.leftLine.p0, p1: new THREE.Vector3(p0.x, 0, p0.y) },
                        rightLine: { p0: corridorCurrent.rightLine.p0, p1: new THREE.Vector3(p1.x, 0, p1.y) },
                    }
                    const corridorPrev = oldCorridors.filter(c => c.id === corridorCurrent.prevId)
                    if (corridorPrev && corridorPrev.length === 1) {
                        corridorPrev.nextId = c1.id
                    }
                    const c2 = {
                         id: c2Id,
                         prevId: c1.prevId,
                         nextId: corridorCurrent.nextId,
                         type: 'corridor',
                         axis: { p0: new THREE.Vector3(interceptAxis1.x, 0, interceptAxis1.y), p1: corridorCurrent.axis.p1 },
                         leftLine: { p0: new THREE.Vector3(p3.x, 0, p3.y), p1: corridorCurrent.leftLine.p1 },
                         rightLine: { p0: new THREE.Vector3(p2.x, 0, p2.y), p1: corridorCurrent.rightLine.p1 },
                    }
                    const corridorNext = oldCorridors.filter(c => c.id === corridorCurrent.nextId)
                    if (corridorNext && corridorNext.length === 1) {
                         corridorNext.prevId = c2.id
                    }

                    const interceptAxis3 = M.line_intersect(
                        corridorWith.axis.p0.x, corridorWith.axis.p0.z,
                        corridorWith.axis.p1.x, corridorWith.axis.p1.z,
                        corridorCurrent.leftLine.p0.x, corridorCurrent.leftLine.p0.z,
                        corridorCurrent.leftLine.p1.x, corridorCurrent.leftLine.p1.z,
                    )
                    addBox(new THREE.Vector3(interceptAxis3.x, 0, interceptAxis3.y), 0xFFFFFF)

                    const interceptAxis4 = M.line_intersect(
                        corridorWith.axis.p0.x, corridorWith.axis.p0.z,
                        corridorWith.axis.p1.x, corridorWith.axis.p1.z,
                        corridorCurrent.rightLine.p0.x, corridorCurrent.rightLine.p0.z,
                        corridorCurrent.rightLine.p1.x, corridorCurrent.rightLine.p1.z,
                    )
                    addBox(new THREE.Vector3(interceptAxis4.x, 0, interceptAxis4.y), 0xFF00ff)
                    //
                    //
                    const c4Id = getID()
                    const c3 = {
                        id: getID(),
                        nextId: c4Id,
                        prevId: corridorWith.prevId,
                        type: 'corridor',
                        axis: { p0: corridorWith.axis.p0, p1: new THREE.Vector3(interceptAxis3.x, 0, interceptAxis3.y) },
                        leftLine: { p0: corridorWith.leftLine.p0, p1: new THREE.Vector3(p3.x, 0, p3.y) },
                        rightLine: { p0: corridorWith.rightLine.p0, p1: new THREE.Vector3(p0.x, 0, p0.y) },
                    }
                    const prevElm = oldCorridors.filter(c => c.id === corridorWith.prevId)
                     if (prevElm && prevElm.length === 1) {
                         prevElm.nextId = c3.id
                    }
                    //
                    const c4 = {
                         id: c4Id,
                         nextId: corridorWith.nextId,
                         prevId: c3.id,
                         type: 'corridor',
                         axis: { p0: new THREE.Vector3(interceptAxis4.x, 0, interceptAxis4.y), p1: corridorWith.axis.p1 },
                         leftLine: { p0: new THREE.Vector3(p2.x, 0, p2.y), p1: corridorWith.leftLine.p1 },
                         rightLine: { p0: new THREE.Vector3(p1.x, 0, p1.y), p1: corridorWith.rightLine.p1 },
                    }
                    //
                    const nextElm = oldCorridors.filter(c => c.id === corridorWith.nextId)
                     if (nextElm && nextElm.length === 1) {
                         nextElm.prevId = c4.id
                    }

                    drawLines(c1)
                    drawLines(c2)
                    drawLines(c3)
                    drawLines(c4)

                    newCorridors = []
                    for (let i = 0; i < oldCorridors.length; ++i) {
                        if (oldCorridors[i].id === corridorCurrent.id) {
                            newCorridors.push(c1, c2)
                        } else if (oldCorridors[i].id === corridorWith.id) {
                            //newCorridors.push(c3, c4)
                        } else {
                            newCorridors.push(oldCorridors[i])
                        }

                    }
                    return void res(newCorridors)
                }
                //res(oldCorridors)
            })
        }

        const iterate = (corridors) => {
            checkIntercept(corridors).then(crossData => {
                if (crossData) {
                    createCrossByIntercept(crossData, corridors).then(newCorridors => {
                        console.log(newCorridors)
                        setTimeout(() => {
                            iterate(newCorridors)
                        }, 30)

                    })
                } else {
                    corridors.push(...crosses)
                    res(corridors)
                }
            })
        }
        iterate(oldCorridors)
    })
}


export const createSchemeLines = (st) => {
    return new Promise(res => {
        studio = st

        const lines = createLines()
        const linesClipped = getConnectionsWithNears(lines)
        const addedCorners = addCorners(linesClipped)
        addCrosses(addedCorners).then(result => {
            res(result)
        })
    })


    // for (let i = 0; i < addedCorners.length; ++i) {
    //     if (addedCorners[i].type === 'corridor') {
    //         const l = createLineFromVectors(lines[i].axis.p0, lines[i].axis.p1, 0xFF0000)
    //         const l1 = createLineFromVectors(linesClipped[i].leftLine.p0, linesClipped[i].leftLine.p1, 0xFFFF00)
    //         const l2 = createLineFromVectors(lines[i].rightLine.p0, lines[i].rightLine.p1, 0x00FFFF)
    //         studio.addToScene(l)
    //         studio.addToScene(l1)
    //         studio.addToScene(l2)
    //     }
    //     if (addedCorners[i].type === 'corner') {
    //         const l = createLineFromVectors(addedCorners[i].p0, addedCorners[i].p1, 0xffffff)
    //         studio.addToScene(l)
    //     }
    // }

    //return lines
}
