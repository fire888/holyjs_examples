import { W, H, THICKNESS_PLATFORM } from '../structure/constants'
import { M } from '../structure/M'
import { createPlatformData } from './elemPlatform'

const hpW = W / 6

export const tile_B = () => {
    const v = []
    const c = []
    const uv = []
    const col = []
    /** bottom */
    {
        const platform = createPlatformData({
            nX_pZ: [-hpW, 0, -hpW],
            pX_pZ: [hpW, 0, -hpW],
            pX_nZ: [hpW, H / 2, -W / 2],
            nX_nZ: [-hpW, H / 2, -W / 2],
        })

        v.push(...platform.v)
        c.push(...platform.c)
        uv.push(...platform.uv)
        col.push(...platform.col)
    }
    return { v, c, uv, col }
}
