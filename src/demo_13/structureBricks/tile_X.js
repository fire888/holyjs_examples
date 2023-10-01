import { W, H } from './constants'
import { M } from './M'
import { createPlatformData } from './elemPlatform'
import { tile_I } from './tile_I'


export const tile_X = () => {
    const v = []
    const c = []
    const uv = []
    const col = []

    const tileIData = tile_I()
    v.push(...tileIData.v)
    uv.push(...tileIData.uv)
    c.push(...tileIData.c)
    col.push(...tileIData.col)

    {
        const platform = createPlatformData({})
        M.translateVertices(platform.v, W / 3, H / 2, 0)
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        M.translateVertices(platform.col, W / 3, H / 2, 0)
        col.push(...platform.col)
    }
    {
        const platform = createPlatformData({})
        M.translateVertices(platform.v, -W / 3, H / 2, 0)
        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        M.translateVertices(platform.col, -W / 3, H / 2, 0)
        col.push(...platform.col)
    }
    return { v, c, uv, col }
}
