import { M } from './M'

const createDataSideColumn = ({ h = 2, r = .1, color1 = [1, 0, 0], color2 = [0, 1, 0] }) => {
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
        if (h - newH < r * 2) newH = h // clamp last step not small
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
            //color2,
        )
        v.push(...poly.vArr)
        c.push(...poly.cArr)
        uv.push(...poly.uArr)

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

export const column = ({ h = 2, r = .1, color1 = [1, 0, 0], color2 = [0, 1, 0] }) => {
    const v = []
    const c = []
    const uv = []

    const side = createDataSideColumn({ h, r, color1, color2 })

    const copyV1 = [...side.v]
    M.rotateVerticesY(copyV1, Math.PI / 2)
    v.push(...copyV1)
    c.push(...side.c)
    uv.push(...side.uv)

    const copyV2 = [...side.v]
    M.rotateVerticesY(copyV2, -Math.PI / 2)
    v.push(...copyV2)
    c.push(...side.c)
    uv.push(...side.uv)

    const copyV3 = [...side.v]
    M.rotateVerticesY(copyV3, Math.PI)
    v.push(...copyV3)
    c.push(...side.c)
    uv.push(...side.uv)

    v.push(...side.v)
    c.push(...side.c)
    uv.push(...side.uv)

    const l = side.v.length
    v.push(...M.createPolygon(
        [side.v[l - 3], side.v[l - 2], side.v[l - 1]],
        [side.v[l - 6], side.v[l - 5], side.v[l - 4]],
        [copyV3[l - 3], copyV3[l - 2], copyV3[l - 1]],
        [copyV3[l - 6], copyV3[l - 5], copyV3[l - 4]],
    ))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    return { v, c, uv }
}
