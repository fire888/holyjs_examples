import { W, H, THICKNESS_PLATFORM } from '../structure/constants'
import { M } from '../structure/M'
import { createColumnData } from './elemColumn'
import { createPlatformData } from './elemPlatform'
import {createElemArcData} from "./elemArc"

export const tile_T = () => {
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

    /** center */
    {
        const platform = createPlatformData({})
        M.translateVertices(platform.v, 0, H / 2, 0)
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        M.translateVertices(platform.col, 0, H / 2, 0)
        col.push(...platform.col)
    }
    /** bottom */
    {
        const platform = createPlatformData({})
        M.translateVertices(platform.v, 0, H / 2, W / 3)
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        M.translateVertices(platform.col, 0, H / 2, W / 3)
        col.push(...platform.col)
    }
    /** top */
    {
        const platform = createPlatformData({})
        M.translateVertices(platform.v, 0, H / 2, -W / 3)
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        M.translateVertices(platform.col, 0, H / 2, -W / 3)
        col.push(...platform.col)
    }
    /** right */
    {
        const platform = createPlatformData({})
        M.translateVertices(platform.v, W / 3, H / 2, 0)
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        M.translateVertices(platform.col, W / 3, H / 2, 0)
        col.push(...platform.col)
    }
    return { v, c, uv, col }
}
