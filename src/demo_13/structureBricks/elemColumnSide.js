import { M } from './M'
import { COLOR_01, COLOR_02 } from './constants'

export const createDataSideColumn = ({ h = 2, r = .1, color1 = COLOR_01, color2 = COLOR_02 }) => {
    const v = []
    const c = []
    const uv = []

    let i = -1
    let rLast = null
    let currH = 0

    while (currH < h) {
        ++i
        const currentStep = r * M.ran(2, 8)

        let newH = currH + currentStep
        if (h - newH < r * 2) newH = h + .01 // clamp last step not small
        if (i === 0) newH = newH * .3 // bottom base

        /** bottom base */
        if (i === 0) {
            v.push(...M.createPolygon([-r, currH, r], [r, currH, r], [r, newH, r], [-r, newH, r]))
            c.push(...M.fillColorFace(color1))
            uv.push(...M.createUv([.5, 0], [1, 0], [1, .5], [.5, .5],))
            rLast = r
            currH = newH
            continue;
        }
        let h0 = currH
        let h1 = h0 + currentStep * 0.1
        let r1 = rLast
        let r2 = M.ran(r * .4, r * 1.8)
        v.push(...M.createPolygon([-r1, h0, r1], [r1, h0, r1], [r2, h1, r2], [-r2, h1, r2],))
        c.push(...M.fillColorFace(color2))
        uv.push(...M.createUv([.5, 0], [1, 0], [1, .5], [.5, .5],))
        /** square */
        const diff2 = M.ran(.5, 1.2) * r
        h0 = h1
        h1 = newH - diff2
        r1 = r2
        r2 = r1
        const poly = M.createFaceWithSquare([-r1, h0, r1], [r1, h0, r1], [r2, h1, r2], [-r2, h1, r2],
            newH === h ? color2 : color1,
            newH === h ? color1 : color2,
        )
        v.push(...poly.vArr)
        c.push(...poly.cArr)
        //uv.push(...poly.uArr)
        uv.push(...M.getUvByLen(poly.vArr))

        h0 = h1
        h1 = newH - diff2 * .7
        r1 = r2
        r2 = newH === h
            ? r
            : M.ran(r * .4, r * 2)
        v.push(...M.createPolygon([-r1, h0, r1], [r1, h0, r1], [r2, h1, r2], [-r2, h1, r2],))
        c.push(...M.fillColorFace(color2))
        uv.push(...M.createUv([.5, 0], [1, 0], [1, .5], [.5, .5],))
        /** belt */
        h0 = h1
        h1 = newH
        r1 = r2
        r2 = r1
        v.push(...M.createPolygon([-r1, h0, r1], [r1, h0, r1], [r2, h1, r2], [-r2, h1, r2],))
        c.push(...M.fillColorFace(color1))
        uv.push(...M.createUv([.5, 0], [1, 0], [1, .5], [.5, .5],))

        rLast = r2
        currH = newH
    }
    return { v, c, uv }
}
