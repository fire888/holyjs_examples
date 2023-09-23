import { W, H, THICKNESS_PLATFORM } from './constants'
import { M } from './M'
import { createColumnData } from './elemColumn'
import { createPlatformData } from './elemPlatform'
import {createElemArcData} from "./elemArc"

const hpW = W / 6


export const tile_STAIRS = () => {
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
            pX_nZ: [hpW, H / 4, -hpW - W / 6],
            nX_nZ: [-hpW, H / 4, -hpW - W / 6],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-hpW , H / 4, -hpW - W / 6],
            pX_pZ: [hpW, H / 4, -hpW - W / 6],
            pX_nZ: [hpW, H / 4, -hpW - W / 3],
            nX_nZ: [-hpW, H / 4, -hpW - W / 3],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-hpW * 2 , H / 2.5, -60],
            pX_pZ: [-hpW, H / 4, -60],
            pX_nZ: [-hpW, H / 4, -80],
            nX_nZ: [-hpW * 2, H / 2.5, -80],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-80, H / 2.5, -60],
            pX_pZ: [-hpW * 2, H / 2.5, -60],
            pX_nZ: [-hpW * 2, H / 2.5, -80],
            nX_nZ: [-80, H / 2.5, -80],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-80, H / 2, -hpW],
            pX_pZ: [-hpW * 2, H / 2, -hpW],
            pX_nZ: [-hpW * 2, H / 2.5, -60],
            nX_nZ: [-80, H / 2.5, -60],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    /** L */
    {
        const platform = createPlatformData({
            nX_pZ: [-80, H / 2, hpW],
            pX_pZ: [-hpW * 2, H / 2, hpW],
            pX_nZ: [-hpW * 2, H / 2, -hpW],
            nX_nZ: [-80, H / 2, -hpW],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-80, H * .75, hpW * 2],
            pX_pZ: [-hpW * 2, H * .75, hpW * 2],
            pX_nZ: [-hpW * 2, H / 2, hpW],
            nX_nZ: [-80, H / 2, hpW],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-80, H * .75, 80],
            pX_pZ: [-hpW * 2, H * .75, 80],
            pX_nZ: [-hpW * 2, H * .75, hpW * 2],
            nX_nZ: [-80, H * .75, hpW * 2],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-hpW * 2, H * .75, 80],
            pX_pZ: [-hpW, H * .85, 80],
            pX_nZ: [-hpW, H * .85, hpW * 2],
            nX_nZ: [-hpW * 2, H * .75, hpW * 2],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-hpW, H * .85, 80],
            pX_pZ: [hpW, H * .85, 80],
            pX_nZ: [hpW, H * .85, hpW * 2],
            nX_nZ: [-hpW, H * .85, hpW * 2],
        })
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({
            nX_pZ: [-hpW, H * .85, hpW * 2],
            pX_pZ: [hpW, H * .85, hpW * 2],
            pX_nZ: [hpW, H, hpW],
            nX_nZ: [-hpW, H, hpW],
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
