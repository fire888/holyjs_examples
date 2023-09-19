import { M } from './M'
const { sin, cos, PI } = Math

export const arc = ({
    h = 1,
    beltH = .05,
    w = 2,
    d = 0.03,
    n = 15,
    color1 = [1, 0, 0],
    color2 = [0, 1, 1],
}) => {
    const v = []
    const uv = []
    const c = []

    const r = w / 2
    const hBelt = h - beltH
    const arcH = hBelt - (h * .05)
    const z = d - (d * .2)

    const points = []
    for (let i = 0; i < n; ++i) {
        points.push([
            cos((n - i) / n * PI) * r,
            sin((n - i) / n * PI) * arcH,
            z,
        ])
    }
    points.push([w / 2, 0, z])

    for (let i = 1; i < points.length; ++i) {
        const d = M.createPolygon(
            [...points[i - 1]],
            [...points[i]],
            [points[i][0], h, z],
            [points[i - 1][0], h, z],
        )
        v.push(...d)
        c.push(...M.fillColorFace(color2))
        const d1 = M.createPolygon(
            [points[i - 1][0], points[i - 1][1], 0],
            [points[i][0], points[i][1], 0],
            [...points[i]],
            [...points[i - 1]],
        )
        v.push(...d1)
        c.push(...M.fillColorFace(color1))
    }
    const uvElem = M.getUvByLen(v)
    uv.push(...uvElem)

    v.push(...M.createPolygon([-w / 2, hBelt, 0], [w / 2, hBelt, 0], [w / 2, hBelt, d], [-w / 2, hBelt, d],))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    v.push(...M.createPolygon([-w / 2, hBelt, d], [w / 2, hBelt, d], [w / 2, h, d], [-w / 2, h, d],))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    v.push(...M.createPolygon([-w / 2, h, d], [w / 2, h, d], [w / 2, h, 0], [-w / 2, h, 0],))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))
    const copy = [...v]
    M.rotateVerticesY(copy, PI)
    v.push(...copy)
    c.push(...c)
    uv.push(...uv)
    return {v, c, uv}
}
