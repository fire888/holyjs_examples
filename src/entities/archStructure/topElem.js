import { M } from './M'
const { sin, cos, random, PI } = Math
const PI2 = PI * 2

export const topElem = ({ color1 = [1, 0, 0], color2 = [0, 0, 1], h = 1, r = .1 }) => {
    const v = []
    const c = []
    const uv = []

    const hl0 = 0
    const hl1 = hl0 + random() * 0.3 * h // base
    const hl2 = hl1 + random() * 0.3 * h
    const hl3 = hl2 + random() * 0.3 * h // trunk
    const hl4 = hl3 + random() * .1 * h
    const hl5 = hl4 + random() * .2 * h // belt
    const diff = h - hl5
    const hl6 = hl5
    const hl7 = hl6 + diff * random()
    const hl8 = h

    const count = 6
    for (let i = 0; i < count; ++i) {
        let nextI = i + 1
        nextI > count && (nextI = 0)
        const a1 = i / count * PI2
        const a2 = nextI / count * PI2
        const sA1 = sin(a1)
        const cA1 = cos(a1)
        const sA2 = sin(a2)
        const cA2 = cos(a2)

        /** bottom cylinder */
        let r1 = r
        let r2 = r
        v.push(...M.createPolygon(
            [sA1 * r1, hl0, cA1 * r1],
            [sA2 * r1, hl0, cA2 * r1],
            [sA2 * r2, hl1, cA2 * r2],
            [sA1 * r2, hl1, cA1 * r2],
        ))

        /** connect */
        r1 = r2
        r2 = r * .3
        v.push(...M.createPolygon(
            [sA1 * r1, hl1, cA1 * r1],
            [sA2 * r1, hl1, cA2 * r1],
            [sA2 * r2, hl2, cA2 * r2],
            [sA1 * r2, hl2, cA1 * r2],
        ))

        /** center cylinder */
        r1 = r2
        r2 = r1
        v.push(...M.createPolygon(
            [sA1 * r1, hl2, cA1 * r1],
            [sA2 * r1, hl2, cA2 * r1],
            [sA2 * r2, hl3, cA2 * r2],
            [sA1 * r2, hl3, cA1 * r2],
        ))

        /** connect */
        r1 = r2
        r2 = r
        v.push(...M.createPolygon(
            [sA1 * r1, hl3, cA1 * r1],
            [sA2 * r1, hl3, cA2 * r1],
            [sA2 * r2, hl4, cA2 * r2],
            [sA1 * r2, hl4, cA1 * r2],
        ))

        r1 = r2
        r2 = r1
        /** baraban */
        v.push(...M.createPolygon(
            [sA1 * r1, hl4, cA1 * r1],
            [sA2 * r1, hl4, cA2 * r1],
            [sA2 * r2, hl5, cA2 * r2],
            [sA1 * r2, hl5, cA1 * r2],
        ))

        r1 = r2
        r2 = r * 0.3
        v.push(...M.createPolygon(
            [sA1 * r1, hl5, cA1 * r1],
            [sA2 * r1, hl5, cA2 * r1],
            [sA2 * r2, hl6, cA2 * r2],
            [sA1 * r2, hl6, cA1 * r2],
        ))

        r1 = r2
        r2 = r
        v.push(...M.createPolygon(
            [sA1 * r1, hl6, cA1 * r1],
            [sA2 * r1, hl6, cA2 * r1],
            [sA2 * r2, hl7, cA2 * r2],
            [sA1 * r2, hl7, cA1 * r2],
        ))

        v.push(
            sA1 * r2, hl7, cA1 * r2,
            sA2 * r2, hl7, cA2 * r2,
            0, hl8, 0,
        )

        c.push(
            ...M.fillColorFace(color1),
            ...M.fillColorFace(color2),
            ...M.fillColorFace(color2),
            ...M.fillColorFace(color2),
            ...M.fillColorFace(color1),
            ...M.fillColorFace(color1),
            ...M.fillColorFace(color1),
            ...color1,
            ...color1,
            ...color1,
        )

        uv.push(
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...[0, .5],
            ...[.5, .5],
            ...[.25, 1],
        )
    }

    return { v, c, uv }
}
