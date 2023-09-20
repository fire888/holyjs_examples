const { sin, cos, PI, random, floor } = Math
const PI2 = PI * 2

export const createStructure = () => {
    const color1 =  [.3, .3, .5]
    const color2 =  [1, 1, .5]

    const center = {
        x: 0, y: 0, z: 0,
        nH: floor(random() * 10) + 2,
        segments: [],
    }

    let y = 0
    for (let i = 0; i < center.nH; ++i) {
        const hCol = Math.random() * 3 + .5
        const hArc = Math.random() * 1.2 + .5
        center.segments.push({ hCol, hArc, y })
        y = y + hCol + hArc
    }

    const rays = []
    const raysN = floor(random() * 10) + 2
    for (let i = 0; i < raysN; ++i) {
        const rot = random() * PI2
        rays.push({ rot })
    }

    const arr = []

    const createPart = ({ hArc, hCol, r, w, x, y, z, rot, isArc, isTop }) => {
         arr.push({ type: 'column', h: hCol, r: .2, x, y, z, rot, color1, color2 })
         arr.push({ type: 'columnSimple', h: hArc, r, x, y: y + hCol, z, rot, color1, color2 })
         if (isArc) {
             arr.push({ type: 'arc', h: hArc, w, x, y: y + hCol, z, rot, color1, color2 })
         }
         if (isTop) {
             if (random() < .5) {
                 const hE = hCol + Math.random() * hCol
                 arr.push({ type: 'column', h: hE, r: .2, x, y: y + hCol + hArc, z, rot, color1, color2 })
                 y += hE
             }
             arr.push({ type: 'topElem', h: Math.random() * 1.5 + 1, r, x, y: y + hCol + hArc, z, rot, color1, color2 })
         }
    }

    for (let i = 0; i < center.segments.length; ++i) {
        const { hArc, hCol, y } = center.segments[i]
        createPart({ hArc, hCol, r: .3, w: 0, x: 0, y, z: 0, rot: 9, isArc: false, isTop: i === center.segments.length - 1 })
    }

    for (let i = 0; i < rays.length; ++i) {
        const { rot } = rays[i]

        let currentD = 0
        const lenRay = Math.floor(random() * 10) + 1

        for (let nR = 0; nR < lenRay; ++nR) {
            const newD = currentD + random() * 3 + .5
            const w = newD - currentD
            const x = sin(rot) * newD
            const z = cos(rot) * newD

            for (let nF = 0; nF < center.segments.length; ++nF) {
                if (nF > (lenRay - nR)) {
                    continue
                }
                const { hArc, hCol, y } = center.segments[nF]
                createPart({
                    hCol,
                    hArc,
                    r: .2,
                    x,
                    y,
                    z,
                    w,
                    rot,
                    isArc: Math.random() < .7,
                    isTop: nF === center.segments.length - 1 || nF === (lenRay - nR)
                })
            }
            currentD = newD
        }




    }

    return arr
}
