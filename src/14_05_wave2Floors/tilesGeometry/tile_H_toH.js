import { W, H, THICKNESS_PLATFORM } from '../CONSTANTS'
import { M } from '../helpersMeshes/M'
import { createPlatformData } from './elemPlatform'
import { tile_H } from './tile_H'

const hpW = W / 6

export const tile_H_toH = () => {
    const v = []
    const c = []
    const uv = []
    const col = []

    const t = tile_H()
    v.push(...t.v)
    uv.push(...t.uv)
    c.push(...t.c)
    col.push(...t.col)

    {
        const platform = createPlatformData({
            nX_pZ: [-hpW, 0, W / 2],
            pX_pZ: [hpW, 0, W / 2],
            pX_nZ: [hpW, H * 0.5, hpW],
            nX_nZ: [-hpW, H * 0.5, hpW],
        })
        M.translateVertices(platform.v, 0, H * 0.5, 0)
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        M.translateVertices(platform.col, 0, H * 0.5, 0)
        col.push(...platform.col)
    }
    return { v, c, uv, col }
}
