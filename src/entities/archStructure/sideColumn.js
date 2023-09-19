// import {
//     createFace,
//     createUv,
//     createFaceWithSquare,
//     fillColorFace,
// } from './helpers'

import { M } from './M'
const lCol = [.3, 1, .3]
const lW = .2



const createTrunk = ({
                         h = 2,
                         h2 = 30,
                         r = 10,
                         color1 = [.2, .1, .1],
                         color2 = [1, 1, 1],
                     }) => {
    const arrDividers = []
    let leftH = h2 - h
    let currentH = h
    while (leftH > 0) {
        const h01 = M.ran(0.5, 10)
        const h02 = M.ran(0.5, 4)
        const h03 = M.ran(0.5, 4)
        const h04 = M.ran(0.5, .2, 4)
        const fullH = h01 + h02 + h03 + h04
        leftH -= fullH
        if (leftH > 5) {
            arrDividers.push({
                h0: currentH,
                h01: currentH + h01,
                h02: currentH + h01 + h02,
                h03: currentH + h01 + h02 + h03,
                h04: currentH + h01 + h02 + h03 + h04,
                r: M.ran(1, 10),
            })
        }
        currentH = currentH + fullH
    }


    const vert = []
    const col = []
    const uv = []



    if (arrDividers.length === 0) {
        vert.push(
            ...M.createPolygon(
                [-r, h, r],
                [r, h, r],
                [r, h2, r],
                [-r, h2, r],
            )
        )
        col.push(...M.fillColorFace(color1))
        uv.push(...M.createUv(
            [0, .5],
            [.5, .5],
            [.5, 1],
            [0, 1],
        ))
    } else {
        for (let i = 0; i < arrDividers.length; ++i) {
            /** column ***/
            const { vArr, cArr, uArr } = M.createFaceWithSquare(
                [-r, arrDividers[i].h0, r],
                [r, arrDividers[i].h0, r],
                [r, arrDividers[i].h01, r],
                [-r, arrDividers[i].h01, r],
                color2,
                color2,
            )
            vert.push(...vArr)
            col.push(...cArr)
            uv.push(...uArr)
            /** column -> divider */
            vert.push(
                ...M.createPolygon(
                    [-r, arrDividers[i].h01, r],
                    [r, arrDividers[i].h01, r],
                    [arrDividers[i].r, arrDividers[i].h02, arrDividers[i].r],
                    [-arrDividers[i].r, arrDividers[i].h02, arrDividers[i].r],
                )
            )
            col.push(...M.fillColorFace(color2))
            uv.push(...M.createUv(
                [0, .5],
                [.5, .5],
                [.5, 1],
                [0, 1],
            ))
            /** divider */
            vert.push(
                ...M.createPolygon(
                    [-arrDividers[i].r, arrDividers[i].h02, arrDividers[i].r],
                    [arrDividers[i].r, arrDividers[i].h02, arrDividers[i].r],
                    [arrDividers[i].r, arrDividers[i].h03, arrDividers[i].r],
                    [-arrDividers[i].r, arrDividers[i].h03, arrDividers[i].r],
                )
            )
            col.push(...M.fillColorFace(color1))
            uv.push(...M.createUv(
                [0, .5],
                [.5, .5],
                [.5, 1],
                [0, 1],
            ))
            /** divider -> column */
            vert.push(
                ...M.createPolygon(
                    [-arrDividers[i].r, arrDividers[i].h03, arrDividers[i].r],
                    [arrDividers[i].r, arrDividers[i].h03, arrDividers[i].r],
                    [r, arrDividers[i].h04, r],
                    [-r, arrDividers[i].h04, r],
                )
            )
            col.push(...M.fillColorFace(color2))
            uv.push(...M.createUv(
                [0, .5],
                [.5, .5],
                [.5, 1],
                [0, 1],
            ))
        }

        /** last segment */
        const { vArr, cArr, uArr } = M.createFaceWithSquare(
            [-r, arrDividers[arrDividers.length - 1].h04, r],
            [r, arrDividers[arrDividers.length - 1].h04, r],
            [r, h2, r],
            [-r, h2, r],
            color2,
            color1,
        )
        vert.push(...vArr)
        col.push(...cArr)
        uv.push(...uArr)
    }

    return { vert, col, uv }
}


export const createDataSideColumn = ({
    h = 2,
    r = .1,
    color1 = [1, 0, 0],
    color2 = [0, 1, 0],
 }) => {
    const v = []
    const c = []
    const uv = []

    let i = -1
    let currH = 0
    while (currH < h) {
        ++i

        let newH = currH + Math.random() * .3 + .1
        if (newH > h) {
            newH = h
        }

        const diff = newH - currH

        /** base **/
        let h0 = currH
        let h1 = h0 + diff * .2
        let r1 = r
        let r2 = r1
        v.push(...M.createPolygon(
            [-r1, h0, r1],
            [r1, h0, r1],
            [r2, h1, r2],
            [-r2, h1, r2],
        ))
        c.push(...M.fillColorFace(color1))
        uv.push(...M.createUv([.5, 0], [1, 0], [1, .5], [.5, .5],))

        h0 = h1
        h1 = h0 + diff * .2
        r1 = r
        r2 = r1 * .3
        v.push(...M.createPolygon(
            [-r1, h0, r1],
            [r1, h0, r1],
            [r2, h1, r2],
            [-r2, h1, r2],
        ))
        c.push(...M.fillColorFace(color2))
        uv.push(...M.createUv([.5, 0], [1, 0], [1, .5], [.5, .5],))

        h0 = h1
        h1 = newH
        r1 = r2
        r2 = r1
        const p5 = M.createFaceWithSquare(
            [-r1, h0, r1],
            [r1, h0, r1],
            [r2, h1, r2],
            [-r2, h1, r2],
            color1,
            color2,
        )
        v.push(...p5.vArr)
        c.push(...p5.cArr)
        uv.push(...p5.uArr)


        currH = newH
    }

    /** base */



    // let r1 = r, r2 = r * .4
    // v.push(...M.createPolygon(
    //     [-r1, hl1, r1],
    //     [r1, hl1, r1],
    //     [r2, hl2, r2],
    //     [-r2, hl2, r2],
    // ))
    // c.push(...M.fillColorFace(color2))
    // uv.push(...M.createUv(
    //     [.5, 0],
    //     [1, 0],
    //     [1, .5],
    //     [.5, .5],
    // ))


    // r1 = r2
    // r2 = r1
    // v.push(...M.createFaceWithSquare(
    //     [-r1, hl2, r1],
    //     [r1, hl2, r1],
    //     [r2, hl3, r2],
    //     [-r2, hl3, r2],
    // ))

    // const base1 = M.createPolygon(
    //     [rBase + lW, _h0 - lW, rBase + lW],
    //     [-rBase - lW, _h0 - lW, rBase + lW],
    //     [-rBase - lW, _h1, rBase + lW],
    //     [rBase + lW, _h1, rBase + lW],
    // )
    // const colorBase1 = M.fillColorFace(lCol)
    // const uv1_1 = M.createUv([.1, .1], [.1, .1], [.1, .1], [.1, 1],)
    //
    //
    // _h0 = _h1
    // _h1 = _h0 + hBaseToTrunk
    // const baseToTrunk = [...M.createPolygon(
    //     [-rBase, _h0, rBase],
    //     [rBase, _h0, rBase],
    //     [rTrunk, _h1, rTrunk],
    //     [-rTrunk, _h1, rTrunk],
    // )]
    // const colorBaseToTrunk = [...M.fillColorFace(color2)]
    // const uvBT = M.createUv(
    //     [0, .5],
    //     [.5, .5],
    //     [.4, .7],
    //     [.1, .7],
    // )


    /** TRUNK ************************/


    // let h = hBase + hBaseToTrunk
    //
    // _h0 = _h1
    // _h1 = h1 - hCapital - hTrunkToCapital
    //
    // const { vert, col, uv } = createTrunk({
    //     color1, color2,
    //     h: _h0,
    //     h2: _h1,
    //     r: rTrunk,
    // })
    // const uvT = uv


    /** CAPITAL **************/
    // _h0 = _h1
    // _h1 = h1 - hCapital
    // const trunkToCapital = [...M.createPolygon(
    //     [-rTrunk, _h0, rTrunk],
    //     [rTrunk, _h0, rTrunk],
    //     [rCapital, _h1, rCapital],
    //     [-rCapital, _h1, rCapital],
    // )]
    // _h0 = _h1
    // _h1 = h1
    // const capital = [
    //     ...M.createPolygon(
    //         [-rCapital, _h0, rCapital],
    //         [rCapital, _h0, rCapital],
    //         [rCapital, _h1, rCapital],
    //         [-rCapital, _h1, rCapital],
    //     ),
    // ]
    // const uvC = M.createUv(
    //     [.5, .5],
    //     [1, .5],
    //     [1, 0],
    //     [.5, 0],
    // )


    // const frontVert = [
    //     ...base,
    //     ...base1,
    //     //...baseToTrunk,
    //     //...vert,
    //     //...trunkToCapital,
    //     //...capital,
    // ]
    // const frontColors = [
    //     ...colorBase,
    //     ...colorBase1,
    //     //...colorBaseToTrunk,
    //     //...col,
    //     //...colorBaseToTrunk,
    //     //...colorBase,
    // ]
    // const frontUV = [
    //     ...uv1,
    //     ...uv1_1,
    //     //...uvBT,
    //     //...uvT,
    //     //...uvBT,
    //     //...uvC,
    // ]

    return {
        v,
        c,
        uv,
    }
}
