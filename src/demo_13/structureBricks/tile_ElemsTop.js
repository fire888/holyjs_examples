import { W, H, THICKNESS_PLATFORM } from './constants'
import { M } from './M'
import { topElem } from './elemTop'



export const tile_ElemsTop = () => {
    const v = []
    const c = []
    const uv = []
    const col = []

    const column = topElem({ h: Math.random() * 1.3 + .2 })
    const fill = (x, z) => {
        const copyV = [...column.v]
        M.translateVertices(copyV, x, 0, z)
        v.push(...copyV)
        c.push(...column.c)
        uv.push(...column.uv)
    }
    fill(-W / 3 / 2, -W / 3 / 2)
    fill(W / 3 / 2, -W / 3 / 2)
    fill(-W / 3 / 2, W / 3 / 2)
    fill(W / 3 / 2, W / 3 / 2)

    return { v, c, uv, col }
}
