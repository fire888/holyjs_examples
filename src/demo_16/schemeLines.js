import { createLineFromVectors } from "./lineHelper";
import * as THREE from "three";
import { M } from './M'
import { createLabel } from './label'

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
const drawRoad = (r, y = 0) => {
    const x = r.axis.p0.x + (r.axis.p1.x - r.axis.p0.x) / 3
    const z = r.axis.p0.z + (r.axis.p1.z - r.axis.p0.z) / 3
    const label = createLabel(r.id, "#ff0000", 1)
    label.position.set(x, y, z)
    studio.addToScene(label)

    const l = createLineFromVectors(r.axis.p0, r.axis.p1, 0xFF0000)
    l.position.y = y
    const l1 = createLineFromVectors(r.leftLine.p0, r.leftLine.p1, 0xFFFF00)
    l1.position.y = y
    const l2 = createLineFromVectors(r.rightLine.p0, r.rightLine.p1, 0x00FFFF)
    l2.position.y = y
    studio.addToScene(l)
    studio.addToScene(l1)
    studio.addToScene(l2)
}

const getInterceptLines = (l1, l2) => {
    const intercept = M.vecXZIntercept(l1.p0, l1.p1, l2.p0, l2.p1)
    if (!intercept || !intercept.seg1 || !intercept.seg2) {
        return null
    }
    return intercept
}

const createLines = (points) => {
    const lines = []
    for (let i = 1; i < points.length; ++i) {
        const p0 = new THREE.Vector3().fromArray(points[i - 1])
        const p1 = new THREE.Vector3().fromArray(points[i])
        const dist = p0.distanceTo(p1)
        const dir = new THREE.Vector3().copy(p1).sub(p0).normalize()
        const angle = M.angleFromCoords(dir.x, dir.z)

        const w = .3
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
        /** clip corners prev & next lines */

        /** if intercept left line clip points by intercept */
        const interceptL = getInterceptLines(lines[i - 1].leftLine, lines[i].leftLine)
        if (interceptL && interceptL.seg1 && interceptL.seg2) {
            lines[i - 1].leftLine.p1 = interceptL.v
            lines[i].leftLine.p0 = interceptL.v
        }
        /** if intercept right line clip points by intercept */
        const interceptR = getInterceptLines(lines[i - 1].rightLine, lines[i].rightLine)
        if (interceptR && interceptR.seg1) {
            lines[i - 1].rightLine.p1 = interceptR.v
            lines[i].rightLine.p0 = interceptR.v
        }
    }
    for (let i = 0; i < lines.length; ++i) {
        drawRoad(lines[i])
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

    for (let i = 0; i < corners.length; ++i) {
        const l = createLineFromVectors(corners[i].p0, corners[i].p1, 0xFF0000)
        studio.addToScene(l)
    }

    return lines
}

/** ******************************************************************/
const checkFirstInterceptRoad = corridors => {
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
            if (
                corridors[i].axis.p1.equals(corridors[j].axis.p0) ||
                corridors[i].axis.p0.equals(corridors[j].axis.p1)
            ) {
                return false
            }
            if (
                corridors[i].axis.p0.equals(corridors[j].axis.p1) ||
                corridors[i].axis.p0.equals(corridors[j].axis.p1)
            ) {
                return false
            }
            const intercept = getInterceptLines(corridors[i].axis, corridors[j].axis)
            if (!intercept || !intercept.seg1 || !intercept.seg2) {
                return false
            }
            return {
                v: intercept.v,
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
            iterate()
        }
        iterate()
    })
}

let levelDraw = .5
const createCrossByIntercept = (crossData, oldCorridors) => {
    levelDraw += .3
    return new Promise(res => {
        const corridorCurrent = oldCorridors.filter(n => n.id === crossData.idCorridorCurrent)[0]
        const corridorWith = oldCorridors.filter(n => n.id === crossData.idCorridorWith)[0]

        const interceptAxisWithLeft = getInterceptLines(corridorCurrent.axis, corridorWith.leftLine)
        //addBox(interceptAxisWithLeft.v, 0x0000ff)
        const d1 = interceptAxisWithLeft.v.distanceTo(corridorCurrent.axis.p0)

        const interceptAxisWithRight = getInterceptLines(corridorCurrent.axis, corridorWith.rightLine)
        //addBox(interceptAxisWithRight.v, 0xf000f0)
        const d2 = interceptAxisWithRight.v.distanceTo(corridorCurrent.axis.p0)

        if (d1 < d2) {
            const p0 = getInterceptLines(corridorCurrent.leftLine, corridorWith.leftLine)
            const p1 = getInterceptLines(corridorCurrent.rightLine, corridorWith.leftLine)
            const p2 = getInterceptLines(corridorCurrent.rightLine, corridorWith.rightLine)
            const p3 = getInterceptLines(corridorCurrent.leftLine, corridorWith.rightLine)

            const r2Id = getID()
            const r1 = {
                oldRoadId: corridorCurrent.id,
                id: getID(),
                prevId: corridorCurrent.prevId,
                nextId: r2Id,
                type: 'corridor',
                axis: { p0: corridorCurrent.axis.p0, p1: interceptAxisWithLeft.v },
                leftLine: { p0: corridorCurrent.leftLine.p0, p1: p0.v },
                rightLine: { p0: corridorCurrent.rightLine.p0, p1: p1.v },
            }
            const corridorPrev = oldCorridors.filter(c => c.id === corridorCurrent.prevId)
            if (corridorPrev && corridorPrev.length === 1) {
                corridorPrev.nextId = r1.id
            }
            //drawRoad(r1, levelDraw)
            const r2 = {
                 oldRoadId: corridorCurrent.id,
                 id: r2Id,
                 prevId: r1.id,
                 nextId: corridorCurrent.nextId,
                 type: 'corridor',
                 axis: { p0: interceptAxisWithRight.v, p1: corridorCurrent.axis.p1 },
                 leftLine: { p0: p3.v, p1: corridorCurrent.leftLine.p1 },
                 rightLine: { p0: p2.v, p1: corridorCurrent.rightLine.p1 },
            }
            const corridorNext = oldCorridors.filter(c => c.id === corridorCurrent.nextId)
            if (corridorNext && corridorNext.length === 1) {
                 corridorNext.prevId = r2.id
            }
            //drawRoad(r2, levelDraw)

            const interceptAxisWtoRight = getInterceptLines(corridorWith.axis, corridorCurrent.rightLine)
            //addBox(interceptAxisWtoRight.v, 0x0000FF)
            const interceptAxisWtoLeft = getInterceptLines(corridorWith.axis, corridorCurrent.leftLine)
            //addBox(interceptAxisWtoLeft.v, 0xFF00ff)

            const r4Id = getID()
            const r3 = {
                oldRoadId: corridorWith.id,
                id: getID(),
                nextId: r4Id,
                prevId: corridorWith.prevId,
                type: 'corridor',
                axis: { p0: corridorWith.axis.p0, p1: interceptAxisWtoRight.v },
                leftLine: { p0: corridorWith.leftLine.p0, p1: p1.v },
                rightLine: { p0: corridorWith.rightLine.p0, p1: p2.v },
            }
            const prevElm = oldCorridors.filter(c => c.id === corridorWith.prevId)
            if (prevElm && prevElm.length === 1) {
                 prevElm.nextId = r3.id
            }
            //drawRoad(r3, levelDraw)

            const r4 = {
                oldRoadId: corridorWith.id,
                id: r4Id,
                prevId: r3.id,
                nextId: corridorWith.nextId,
                type: 'corridor',
                axis: { p0: interceptAxisWtoLeft.v, p1: corridorWith.axis.p1 },
                leftLine: { p0: p0.v, p1: corridorWith.leftLine.p1 },
                rightLine: { p0: p3.v, p1: corridorWith.rightLine.p1 },
            }
            const nextElm = oldCorridors.filter(c => c.id === corridorWith.nextId)
            if (nextElm && nextElm.length === 1) {
                 nextElm.prevId = r4.id
            }
            //drawRoad(r4, levelDraw)

            const newCorridors = [r1, r2, r3, r4]
            return res({ newCorridors, crossData: { id: getID(), type: 'cross', p0, p1, p2, p3 } })
        } else {
            const p0 = getInterceptLines(corridorCurrent.leftLine, corridorWith.rightLine)
            const p1 = getInterceptLines(corridorCurrent.rightLine, corridorWith.rightLine)
            const p2 = getInterceptLines(corridorCurrent.rightLine, corridorWith.leftLine)
            const p3 = getInterceptLines(corridorCurrent.leftLine, corridorWith.leftLine)

            const r2Id = getID()
            const r1 = {
                oldRoadId: corridorCurrent.id,
                id: getID(),
                prevId: corridorCurrent.prevId,
                nextId: r2Id,
                type: 'corridor',
                axis: { p0: corridorCurrent.axis.p0, p1: interceptAxisWithRight.v },
                leftLine: { p0: corridorCurrent.leftLine.p0, p1: p0.v },
                rightLine: { p0: corridorCurrent.rightLine.p0, p1: p1.v },
            }
            const corridorPrev = oldCorridors.filter(c => c.id === corridorCurrent.prevId)
            if (corridorPrev && corridorPrev.length === 1) {
                corridorPrev.nextId = r1.id
            }
            //drawRoad(r1, levelDraw)

            const r2 = {
                oldRoadId: corridorCurrent.id,
                id: r2Id,
                prevId: r1.id,
                nextId: corridorCurrent.nextId,
                type: 'corridor',
                axis: { p0: interceptAxisWithLeft.v, p1: corridorCurrent.axis.p1 },
                leftLine: { p0: p3.v, p1: corridorCurrent.leftLine.p1 },
                rightLine: { p0: p2.v, p1: corridorCurrent.rightLine.p1 },
            }
            const corridorNext = oldCorridors.filter(c => c.id === corridorCurrent.nextId)
            if (corridorNext && corridorNext.length === 1) {
                corridorNext.prevId = r2.id
            }
            //drawRoad(r2, levelDraw)

            const interceptAxisWtoLeft = getInterceptLines(corridorWith.axis, corridorCurrent.leftLine)
            //addBox(interceptAxisWtoLeft.v, 0x0000FF)
            const interceptAxisWtoRight = getInterceptLines(corridorWith.axis, corridorCurrent.rightLine)
            //addBox(interceptAxisWtoRight.v, 0xFF00ff)

            const r4Id = getID()
            const r3 = {
                oldRoadId: corridorWith.id,
                id: getID(),
                nextId: r4Id,
                prevId: corridorWith.prevId,
                type: 'corridor',
                axis: { p0: corridorWith.axis.p0, p1: interceptAxisWtoLeft.v },
                leftLine: { p0: corridorWith.leftLine.p0, p1: p3.v },
                rightLine: { p0: corridorWith.rightLine.p0, p1: p0.v },
            }
            const prevElm = oldCorridors.filter(c => c.id === corridorWith.prevId)
            if (prevElm && prevElm.length === 1) {
                prevElm.nextId = r3.id
            }
            //drawRoad(r3, levelDraw)

            const r4 = {
                oldRoadId: corridorWith.id,
                id: r4Id,
                prevId: r3.id,
                nextId: corridorWith.nextId,
                type: 'corridor',
                axis: { p0: interceptAxisWtoRight.v, p1: corridorWith.axis.p1 },
                leftLine: { p0: p2.v, p1: corridorWith.leftLine.p1 },
                rightLine: { p0: p1.v, p1: corridorWith.rightLine.p1 },
            }
            const nextElm = oldCorridors.filter(c => c.id === corridorWith.nextId)
            if (nextElm && nextElm.length === 1) {
                nextElm.prevId = r4.id
            }
            //drawRoad(r4, levelDraw)

            const newCorridors = [r1, r2, r3, r4]
            return res({ newCorridors, crossData: { id: getID(), type: 'cross', p0, p1, p2, p3 } })
        }
    })
}

const pause = t => new Promise(res => setTimeout(res, t))

const addCrosses = items => {
    const corners = items.filter(n => n.type === 'corner')
    const crosses = []
    let resultCorridorsArr = items.filter(n => n.type === 'corridor')

    return new Promise(res => {
        async function findAndInsertFirstCross (corridors) {
            const crossIntercept = await checkFirstInterceptRoad(corridors)
            if (!crossIntercept) {
                return void res([...resultCorridorsArr, ...crosses, ...corners])
            }

            const dataNewRoads = await createCrossByIntercept(crossIntercept, corridors)
            const { newCorridors, crossData } = dataNewRoads
            crosses.push(crossData)

            const changedCorridors = []
            for (let i = 0; i < corridors.length; ++i) {
                let isInsertedNew = false
                for (let j = 0; j < newCorridors.length; ++j) {
                    if (corridors[i].id === newCorridors[j].oldRoadId) {
                        changedCorridors.push(newCorridors[j])
                        isInsertedNew = true
                    }
                }
                if (!isInsertedNew) {
                    changedCorridors.push(corridors[i])
                }
            }
            resultCorridorsArr = changedCorridors
            //await pause(0)
            await findAndInsertFirstCross(resultCorridorsArr)
        }
        findAndInsertFirstCross(resultCorridorsArr)
    })
}


export async function createSchemeLines (st, points) {
    studio = st

    const lines = createLines(points)
    const linesClipped = getConnectionsWithNears(lines)
    const addedCorners = addCorners(linesClipped)
    const result = await addCrosses(addedCorners)
    for (let i = 0; i < result.length; ++i) {
        if (result[i].type === 'corridor') {
            drawRoad(result[i])
        }
        if (result[i].type === 'corner') {
            const l = createLineFromVectors(
                result[i].p0,
                result[i].p1,
                0x333333,
            )
            studio.addToScene(l)
        }
    }
    return result
}
