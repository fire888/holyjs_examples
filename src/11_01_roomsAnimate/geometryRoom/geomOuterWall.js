import { M } from './M'
import { WHITE_1 } from "./constants";

const white6 = M.fillColorFace(WHITE_1)
const uv6 = [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]

let leftPr = null
let rightPr = null
const pos = [0, -28.033300399780273, 18.110000610351562, 0, 24.523099899291992, 16.341800689697266, 0, 26.22130012512207, 15.079400062561035, 0, 73.4574966430664, 15.079400062561035, 0, 89.42109680175781, 30.165700912475586, 0, 108.39409637451172, 30.165700912475586, ]

export const createOuterWall = (dataWall, line) => {
    if (!leftPr) {
        leftPr = [...pos]
        M.rotateVerticesY(leftPr, -Math.PI / 4)
        rightPr = [...pos]
        M.rotateVerticesY(rightPr, Math.PI / 4)
    }

    const v = []
    const c = []
    const b = []
    const u = [] 

    const lX = dataWall.p1[0] - dataWall.p0[0]
    const lZ = dataWall.p0[1] - dataWall.p1[1]

    const l = Math.sqrt(lX * lX + lZ * lZ)
    for (let i = 3; i < pos.length; i += 3) {
        v.push(
            ...M.createPolygon(
                [leftPr[i - 3], leftPr[i - 2], leftPr[i - 1]],
                [rightPr[i - 3] + l, rightPr[i - 2], rightPr[i - 1]],
                [rightPr[i] + l, rightPr[i + 1], rightPr[i + 2]],
                [leftPr[i], leftPr[i + 1], leftPr[i + 2]],
            )
        )
        u.push(...uv6)
        c.push(...white6)
        if (i === 3) {
            b.push(
                ...M.createPolygon(
                    [leftPr[i - 3] - 2, 0, leftPr[i - 1] + 2],
                    [rightPr[i - 3] + l + 2, 0, rightPr[i - 1] + 2],
                    [rightPr[i] + l + 2, 30, rightPr[i + 2] + 2],
                    [leftPr[i] - 2, 30, leftPr[i + 2] + 2],
                )
            )
        }

    }

    const angle = M.angleFromCoords(lX, lZ)

    M.rotateVerticesY(v, angle)
    M.translateVertices(v, dataWall.p0[0], -62, dataWall.p0[1])

    M.rotateVerticesY(b, angle)
    M.translateVertices(b, dataWall.p0[0], -62, dataWall.p0[1])

    return { v, c, b, u }
}


