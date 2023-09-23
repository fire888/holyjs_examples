import {H, COLOR_00} from "./constants";
import { M } from "./M";
import {tileUv, randomTile} from "./atlas";


const { sin, cos } = Math

export const createColumnData = ({
                                     h = H,
                                     w = .02,
                                     bottomW = .05,
                                     bottomH = .05,
                                     topH = .1,
                                 }) => {
    const v = []
    const c = []
    const uv = []
    const col = []

    const h1 = bottomH + (h * .05)
    const h2 = h - topH - (h * .05)
    const h3 = h - topH

    const SIDES = 8
    const R1 = w
    const R2 = bottomW

    const colorPolygon = M.fillColorFace(COLOR_00)

    /** base *****/
    for (let i = 0; i < SIDES; ++i) {
        let a0 = (i - 1) / SIDES * Math.PI * 2
        if (i === 0) {
            a0 = (SIDES - 1) / SIDES * Math.PI * 2
        }
        const a1 = i / SIDES  * Math.PI * 2


        v.push(
            0, -h * .1, 0,
            sin(a1) * R2, 0, cos(a1) * R2,
            sin(a0) * R2, 0, cos(a0) * R2,

            ...M.createPolygon(
                [sin(a0) * R2, 0, cos(a0) * R2],
                [sin(a1) * R2, 0, cos(a1) * R2],
                [sin(a1) * R2, bottomH, cos(a1) * R2],
                [sin(a0) * R2, bottomH, cos(a0) * R2],
            ),

            ...M.createPolygon(
                [sin(a0) * R2, bottomH, cos(a0) * R2],
                [sin(a1) * R2, bottomH, cos(a1) * R2],
                [sin(a1) * R1, h1, cos(a1) * R1],
                [sin(a0) * R1, h1, cos(a0) * R1],
            ),
        )

        uv.push(
            ...tileUv['three'],
            ...tileUv['empty'],
            ...tileUv['line_p1'],
        )

        c.push(
            ...COLOR_00,
            ...COLOR_00,
            ...COLOR_00,
            ...colorPolygon,
            ...colorPolygon,
        )
    }

    let savedL = h1
    while (savedL < h2) {
        let currentL = Math.random() * h * .2 + .1
        if (savedL + currentL > h2) {
            currentL = h2 - savedL
        }

        for (let i = 0; i < SIDES; ++i) {
            let a0 = (i - 1) / SIDES * Math.PI * 2
            if (i === 0) {
                a0 = (SIDES - 1) / SIDES * Math.PI * 2
            }
            const a1 = i / SIDES * Math.PI * 2


            v.push(
                ...M.createPolygon(
                    [sin(a0) * R1, savedL, cos(a0) * R1],
                    [sin(a1) * R1, savedL, cos(a1) * R1],
                    [sin(a1) * R1, savedL + currentL, cos(a1) * R1],
                    [sin(a0) * R1, savedL + currentL, cos(a0) * R1],
                ),
            )

            uv.push(
                ...randomTile(),
            )

            c.push(
                ...colorPolygon,
            )
        }

        savedL = savedL + currentL
    }

    /** top *****/
    for (let i = 0; i < SIDES; ++i) {
        let a0 = (i - 1) / SIDES * Math.PI * 2
        if (i === 0) {
            a0 = (SIDES - 1) / SIDES * Math.PI * 2
        }
        const a1 = i / SIDES  * Math.PI * 2


        v.push(
            ...M.createPolygon(
                [sin(a0) * R1, h2, cos(a0) * R1],
                [sin(a1) * R1, h2, cos(a1) * R1],
                [sin(a1) * R2, h3, cos(a1) * R2],
                [sin(a0) * R2, h3, cos(a0) * R2],
            ),

            ...M.createPolygon(
                [sin(a0) * R2, h3, cos(a0) * R2],
                [sin(a1) * R2, h3, cos(a1) * R2],
                [sin(a1) * R2, h, cos(a1) * R2],
                [sin(a0) * R2, h, cos(a0) * R2],
            ),

            0, h + h * .1, 0,
            sin(a0) * R2, h, cos(a0) * R2,
            sin(a1) * R2, h, cos(a1) * R2,

        )

        uv.push(
            ...tileUv['empty'],
            ...tileUv['line_p1'],
            ...tileUv['three'],
        )

        c.push(
            ...colorPolygon,
            ...colorPolygon,

            ...COLOR_00,
            ...COLOR_00,
            ...COLOR_00,
        )
    }
    return { v, col, uv, c }
}
