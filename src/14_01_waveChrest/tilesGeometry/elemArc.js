import {H, W, COLOR_00} from "../structure/constants";
import { M } from "../structure/M";
import {tileUv} from "./atlas";

const { sin, cos } = Math

export const createElemArcData = ({
                                      w = W / 3,
                                      h = 0,
                                      d = W / 3 / 2,
                                  }) => {
    const v = []
    const c = []
    const uv = []
    const col = []

    const colorPolygon = M.fillColorFace(COLOR_00)

    let startAngle = - Math.PI / 2
    const num = 8
    let stepAngle = Math.PI / num
    const thickness = w * 0.1
    const r0 = (w / 2) - thickness
    const r1 = (w / 2)

    const hR0 = h - r1 - .01

    const topBlockWTop = w * .05
    const topBlockWBottom = topBlockWTop * 0.8
    const topBlockLevelBottom = hR0 + r0


    for (let i = 1; i < num + 1; ++i) {
        const angle0 = startAngle + (stepAngle * (i - 1))
        const angle1 = startAngle + (stepAngle * (i))

        /** front */
        v.push(
            ...M.createPolygon(
                [sin(angle0) * r0, hR0 + cos(angle0) * r0, d],
                [sin(angle1) * r0, hR0 + cos(angle1) * r0, d],
                [sin(angle1) * r1, hR0 + cos(angle1) * r1, d],
                [sin(angle0) * r1, hR0 + cos(angle0) * r1, d],
            )
        )
        c.push(...colorPolygon)
        uv.push(...tileUv['empty'])

        v.push(
            ...M.createPolygon(
                [sin(angle0) * r1, hR0 + cos(angle0) * r1, d],
                [sin(angle1) * r1, hR0 + cos(angle1) * r1, d],
                [sin(angle1) * r1, h, d],
                [sin(angle0) * r1, h, d],
            )
        )
        c.push(...colorPolygon)
        uv.push(...tileUv['empty'])

        /** bottom ark */
        v.push(
            ...M.createPolygon(
                [sin(angle0) * r0, hR0 + cos(angle0) * r0, -d],
                [sin(angle1) * r0, hR0 + cos(angle1) * r0, -d],
                [sin(angle1) * r0, hR0 + cos(angle1) * r0, d],
                [sin(angle0) * r0, hR0 + cos(angle0) * r0, d],
            )
        )
        c.push(...colorPolygon)
        uv.push(...tileUv['columnSide_0'])



        /** back side */
        v.push(
            ...M.createPolygon(
                [sin(angle1) * r0, hR0 + cos(angle1) * r0, -d],
                [sin(angle0) * r0, hR0 + cos(angle0) * r0, -d],
                [sin(angle0) * r1, hR0 + cos(angle0) * r1, -d],
                [sin(angle1) * r1, hR0 + cos(angle1) * r1, -d],
            )
        )
        c.push(...colorPolygon)
        uv.push(...tileUv['empty'])

        v.push(
            ...M.createPolygon(
                [sin(angle1) * r1, hR0 + cos(angle1) * r1, -d],
                [sin(angle0) * r1, hR0 + cos(angle0) * r1, -d],
                [sin(angle0) * r1, h, -d],
                [sin(angle1) * r1, h, -d],
            )
        )
        c.push(...colorPolygon)
        uv.push(...tileUv['empty'])
    }



    {
        v.push(
            ...M.createPolygon(
                [-topBlockWBottom, topBlockLevelBottom, d + 0.001],
                [topBlockWBottom, topBlockLevelBottom, d + 0.001],
                [topBlockWTop, h, d + 0.01],
                [-topBlockWTop, h, d + 0.01],
            )
        )
        c.push(...colorPolygon)
        uv.push(...tileUv['face_00'])
    }


    {
        v.push(
            ...M.createPolygon(
                [topBlockWBottom, topBlockLevelBottom, -d - 0.001],
                [-topBlockWBottom, topBlockLevelBottom, -d - 0.001],
                [-topBlockWTop, h, -d - 0.01],
                [topBlockWTop, h, -d - 0.01],

            )
        )
        c.push(...colorPolygon)
        uv.push(...tileUv['face_00'])
    }


    /** left ***/
    {
        v.push(
            ...M.createPolygon(
                [-w / 2, hR0, -d],
                [-w / 2, hR0, d],
                [-w / 2, h, d],
                [-w / 2, h, -d],

            )
        )
        c.push(...colorPolygon)
        uv.push(...tileUv['briks'])
    }
    /** right */
    {
        v.push(
            ...M.createPolygon(
                [w / 2, hR0, d],
                [w / 2, hR0, -d],
                [w / 2, h, -d],
                [w / 2, h, d],

            )
        )
        c.push(...colorPolygon)
        uv.push(...tileUv['briks'])
    }


    /** bottom */
    v.push(
        ...M.createPolygon(
            [-w / 2, hR0, -d],
            [-r0, hR0, -d],
            [-r0, hR0, d],
            [-w / 2, hR0, d],

        )
    )
    c.push(...colorPolygon)
    uv.push(...tileUv['lines'])

    v.push(
        ...M.createPolygon(
            [r0, hR0, -d],
            [w / 2, hR0, -d],
            [w / 2, hR0, d],
            [r0, hR0, d],

        )
    )
    c.push(...colorPolygon)
    uv.push(...tileUv['lines'])


    return { v, col, uv, c }
}


