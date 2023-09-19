export const createStructure = () => {
    const h0 = 0
    const h1 = Math.random() * 3 + .5
    const h2 = h1 +  Math.random() * 3 + .5
    const h3 = h2 +  Math.random() * 3 + .5
    const h4 = h3 +  Math.random() * 3 + .5

    const color1 =  [.3, .3, .5]
    const color2 =  [1, 1, .5]

    const arr = []

    {
        const hCol = (h1 - h0) * .75
        const hColEasy = (h1 - h0) * .25

        arr.push(
            { type: 'column', h: hCol, r: .1, color1, color2, x: 0, y: 0, z: 0, rot: 0 },
            { type: 'columnSimple', h: hColEasy, r: .1, color1, color2, x: 0, y: hCol, z: 0, rot: 0 },
        )
    }

    {
        const hCol = (h2 - h1) * .75
        const hColEasy = (h2 - h1) * .25

        arr.push(
            { type: 'column', h: hCol, r: .1, color1, color2, x: 0, y: h1, z: 0, rot: 0 },
            { type: 'columnSimple', h: hColEasy, r: .1, color1, color2, x: 0, y: h1 + hCol, z: 0, rot: 0 },
        )
    }

    {
        arr.push(
            { type: 'topElem', h: 1, r: .1, color1, color2, x: 0, y: h2, z: 0, rot: 0 },
        )
    }


    return arr
}
