import { M } from './M'


export const columnSimple = ({
    h = 2,
    r = .1,
    beltH = .05,
    color1 = [1, 0, 0],
    color2 = [0, 1, 0]
}) => {
    const v = []
    const c = []
    const uv = []

    const r1 = r * .8
    const hb = h - beltH

    const vS = [
        ...M.createPolygon(
            [-r1, 0, r1],
            [r1 , 0, r1],
            [r1, h, r1],
            [-r1, h, r1],
        ),
        ...M.createPolygon(
            [-r, hb, r],
            [r, hb, r],
            [r, h, r],
            [-r, h, r],
        )
    ]
    const cS = [
        ...M.fillColorFace(color2),
        ...M.fillColorFace(color1)
    ]
    const uvS = [
        ...M.createUv([0, 0], [.2, 0], [.2, 1], [0, 1]),
        ...M.createUv([0, 0], [.2, 0], [.2, 1], [0, 1]),
    ]

    v.push(...vS)
    c.push(...cS)
    uv.push(...uvS)

    const copyV1 = [...vS]
    M.rotateVerticesY(copyV1, Math.PI / 2)
    v.push(...copyV1)
    c.push(...cS)
    uv.push(...uvS)

    const copyV2 = [...vS]
    M.rotateVerticesY(copyV2, -Math.PI / 2)
    v.push(...copyV2)
    c.push(...cS)
    uv.push(...uvS)

    const copyV3 = [...vS]
    M.rotateVerticesY(copyV3, Math.PI)
    v.push(...copyV3)
    c.push(...cS)
    uv.push(...uvS)

    v.push(...vS)
    c.push(...cS)
    uv.push(...uvS)

    const l = vS.length
    v.push(...M.createPolygon(
        [vS[l - 3], vS[l - 2], vS[l - 1]],
        [vS[l - 6], vS[l - 5], vS[l - 4]],
        [copyV3[l - 3], copyV3[l - 2], copyV3[l - 1]],
        [copyV3[l - 6], copyV3[l - 5], copyV3[l - 4]],
    ))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    v.push(...M.createPolygon(
        [copyV3[l - 6], hb, copyV3[l - 4]],
        [copyV3[l - 3], hb, copyV3[l - 1]],
        [vS[l - 6], hb, vS[l - 4]],
        [vS[l - 3], hb, vS[l - 1]],

    ))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    return { v, c, uv }
}
