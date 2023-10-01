import {H, COLOR_00, COLOR_01, COLOR_02 } from "./constants";
import { M } from "./M";
import {tileUv, randomTile} from "./atlas";
import { createDataSideColumn } from './elemColumnSide'

const { sin, cos } = Math

export const createColumnData = ({ h = H, r = .05, color1 = COLOR_01, color2 = COLOR_02 }) => {
    const v = []
    const c = []
    const uv = []

    const side = createDataSideColumn({h, r, color1, color2})

    const copyV1 = [...side.v]
    M.rotateVerticesY(copyV1, Math.PI / 2)
    v.push(...copyV1)
    c.push(...side.c)
    uv.push(...side.uv)

    const copyV2 = [...side.v]
    M.rotateVerticesY(copyV2, -Math.PI / 2)
    v.push(...copyV2)
    c.push(...side.c)
    uv.push(...side.uv)

    const copyV3 = [...side.v]
    M.rotateVerticesY(copyV3, Math.PI)
    v.push(...copyV3)
    c.push(...side.c)
    uv.push(...side.uv)

    v.push(...side.v)
    c.push(...side.c)
    uv.push(...side.uv)

    const l = side.v.length
    v.push(...M.createPolygon(
        [side.v[l - 3], side.v[l - 2], side.v[l - 1]],
        [side.v[l - 6], side.v[l - 5], side.v[l - 4]],
        [copyV3[l - 3], copyV3[l - 2], copyV3[l - 1]],
        [copyV3[l - 6], copyV3[l - 5], copyV3[l - 4]],
    ))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    return {v, c, uv}
}
