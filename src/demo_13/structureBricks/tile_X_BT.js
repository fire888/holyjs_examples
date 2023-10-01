import { W, H, THICKNESS_PLATFORM } from './constants'
import { M } from './M'
import { createColumnData } from './elemColumn'
import { createPlatformData } from './elemPlatform'
import { createElemArcData } from "./elemArc"

const hpW = W / 6



export const tile_X_BT = () => {
    const v = []
    const c = []
    const uv = []
    const col = []

    const column = createColumnData({})

    const fill = (x, z) => {
        const copyV = [...column.v]
        M.translateVertices(copyV, x, 0, z)
        v.push(...copyV)
        //const copyCol = [...column.col]
        //M.translateVertices(copyCol, x, 0, z)
        //col.push(...copyCol)
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
        M.translateVertices(platform.v, 0, H, 0)
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        M.translateVertices(platform.col, 0, H, 0)
        col.push(...platform.col)
    }

    /** N */
    {
        const platform = createPlatformData({
            nX_pZ: [-hpW , 0, -hpW],
            pX_pZ: [hpW, 0, -hpW ],
            pX_nZ: [hpW, H / 2, -W / 2],
            nX_nZ: [-hpW, H / 2, -W / 2],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [hpW, H, hpW],
            pX_pZ: [W / 2, H / 2, hpW],
            pX_nZ: [W / 2, H / 2, -hpW],
            nX_nZ: [hpW, H, -hpW],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-hpW, H / 2, W / 2],
            pX_pZ: [hpW, H / 2, W / 2],
            pX_nZ: [hpW, 0, hpW],
            nX_nZ: [-hpW, 0, hpW],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-W / 2, H / 2, hpW],
            pX_pZ: [-hpW, H, hpW],
            pX_nZ: [-hpW, H, -hpW],
            nX_nZ: [-W / 2, H / 2, -hpW],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const arc = createElemArcData({})
        M.translateVertices(arc.v, 0, H - THICKNESS_PLATFORM, 0)
        v.push(...arc.v)
        c.push(...arc.c)
        uv.push(...arc.uv)
    }
    return { v, c, uv, col }
}
