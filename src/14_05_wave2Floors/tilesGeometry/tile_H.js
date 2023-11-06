import { W, H, THICKNESS_PLATFORM } from '../CONSTANTS'
import { M } from '../helpersMeshes/M'
import { createColumnData } from './elemColumn'
import { createPlatformData } from './elemPlatform'
import {createElemArcData} from "./elemArc"

const hpW = W / 6

export const tile_H = () => {
    const v = []
    const c = []
    const uv = []
    const col = []

    const column = createColumnData({})
    const fill = (x, z) => {
        const copyV = [...column.v]
        M.translateVertices(copyV, x, 0, z)
        v.push(...copyV)
        const copyCol = [...column.col]
        M.translateVertices(copyCol, x, 0, z)
        col.push(...copyCol)
        c.push(...column.c)
        uv.push(...column.uv)
    }
    fill(-W / 3 / 2, -W / 3 / 2)
    fill(W / 3 / 2, -W / 3 / 2)
    fill(-W / 3 / 2, W / 3 / 2)
    fill(W / 3 / 2, W / 3 / 2)
    /** center  top */
    {
        const platform = createPlatformData({})
        M.translateVertices(platform.v, 0, H, 0)
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        M.translateVertices(platform.col, 0, H, 0)
        col.push(...platform.col)
    }
    /** arc */
    {
        const arc = createElemArcData({})
        M.translateVertices(arc.v, 0, H - THICKNESS_PLATFORM, 0)
        v.push(...arc.v)
        c.push(...arc.c)
        uv.push(...arc.uv)
    }

    return { v, c, uv, col }
}
