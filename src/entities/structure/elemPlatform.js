import { M } from "./M";
import {tileUv} from "./atlas";
import { COLOR_00, H, W, THICKNESS_PLATFORM } from './constants'

const r = W / 6

export const createPlatformData = ({
                                       nX_pZ = [-r, 0, r],
                                       pX_pZ = [r, 0, r],
                                       pX_nZ = [r, 0, -r],
                                       nX_nZ = [-r, 0, -r],
                                       minusH = -THICKNESS_PLATFORM,
                                       color = COLOR_00
                                   }) => {
    const v = []
    const c = []
    const uv = []
    const col = []
    /** sides ***/
    const colorPolygon = M.fillColorFace(color)
    const colorSide = [
        ...colorPolygon,
    ]
    /** top part **/
    v.push(
        ...M.createPolygon(
            [...nX_pZ],
            [...pX_pZ],
            [...pX_nZ],
            [...nX_nZ],
        )
    )
    c.push(...colorSide)
    uv.push(...tileUv['empty'])
    col.push(
        ...M.createPolygon(
            [...nX_pZ],
            [...pX_pZ],
            [...pX_nZ],
            [...nX_nZ],
        )
    )
    /** bottom part  ***/
    v.push(
        ...M.createPolygon(
            [nX_nZ[0], nX_nZ[1] + minusH, nX_nZ[2]],
            [pX_nZ[0], pX_nZ[1] + minusH, pX_nZ[2]],
            [pX_pZ[0], pX_pZ[1] +  minusH, pX_pZ[2]],
            [nX_pZ[0], nX_pZ[1] + minusH, nX_pZ[2]],
        )
    )
    c.push(...colorSide)
    uv.push(...tileUv['points'])
    /** front */
    v.push(
        ...M.createPolygon(
            [nX_pZ[0], nX_pZ[1] + minusH, nX_pZ[2]],
            [pX_pZ[0], pX_pZ[1] + minusH, pX_pZ[2]],
            [pX_pZ[0], pX_pZ[1], pX_pZ[2]],
            [nX_pZ[0], nX_pZ[1], nX_pZ[2]],
        )
    )
    c.push(...colorSide)
    uv.push(...tileUv['gor_pattern_00'])
    /** left */
    v.push(
        ...M.createPolygon(
            [nX_nZ[0], nX_nZ[1] + minusH, nX_nZ[2]],
            [nX_pZ[0], nX_pZ[1] + minusH, nX_pZ[2]],
            [nX_pZ[0], nX_pZ[1], nX_pZ[2]],
            [nX_nZ[0], nX_nZ[1], nX_nZ[2]],
        )
    )
    c.push(...colorSide)
    uv.push(...tileUv['gor_pattern_00'])
    /** right */
    v.push(
        ...M.createPolygon(
            [pX_pZ[0], pX_pZ[1] + minusH, pX_pZ[2]],
            [pX_nZ[0], pX_nZ[1] + minusH, pX_nZ[2]],
            [pX_nZ[0], pX_nZ[1], pX_nZ[2]],
            [pX_pZ[0], pX_pZ[1], pX_pZ[2]],
        )
    )
    c.push(...colorSide)
    uv.push(...tileUv['gor_pattern_00'])
    /** back ***/
    v.push(
        ...M.createPolygon(
            [pX_nZ[0], pX_nZ[1] + minusH, pX_nZ[2]],
            [nX_nZ[0], nX_nZ[1] + minusH, nX_nZ[2]],
            [nX_nZ[0], nX_nZ[1], nX_nZ[2]],
            [pX_nZ[0], pX_nZ[1], pX_nZ[2]],
        )
    )
    c.push(...colorSide)
    uv.push(...tileUv['gor_pattern_00'])
    return { v, col, uv, c }
}


