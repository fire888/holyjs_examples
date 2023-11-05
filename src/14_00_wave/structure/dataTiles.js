const isStrokesNotCompared = (s1, s2) => {
    if (
        (s1 === '_' && s2 === '_')
    ) {
        return false
    }
    if (
        (s1 === '1' && s2 !== '_')
    ) {
        return false
    }
    if (
        (s1 === '_' && s2 !== '_') ||
        (s1 !== '_' && s2 === '_')
    ) {
        return true
    }

    let isClosed = false
    if (s1.includes('closed')) {
        const arrS1 = s1.split('.')
        const arrS2 = s2.split('.')
        arrS1.forEach(n1 => {
            arrS2.forEach(n2 => {
                if (n1 === n2) {
                    isClosed = true
                }
            })
        })
    }

    return isClosed
}


const compareSides = (s1, s2) => {
    if (s1 === s2) {
        return true
    }

    let isCompared = true

    const arrS1 = s1.split('|')
    const arrS2 = s2.split('|')

    arrS1.forEach((item1, i) => {
        const isNotComparedElements = isStrokesNotCompared(arrS1[i], arrS2[i])
        if (isNotComparedElements) {
            isCompared = false
        }
    })

    return isCompared
}


const prepareConnectionTiles = arrTiles => {
    for (let i = 0; i < arrTiles.length; ++i) {
        const tile = arrTiles[i]

        const connectNX = []
        const connectPX = []
        const connectNY = []
        const connectPY = []
        const connectNZ = []
        const connectPZ = []


        const { sideNX, sidePX, sideNY, sidePY, sideNZ, sidePZ } = arrTiles[i]

        for (let j = 0; j < arrTiles.length; ++j) {
            const tileCompare = arrTiles[j]
            if (sideNX === tileCompare.sidePX) {
                connectNX.push(j)
            }
            if (sidePX === tileCompare.sideNX) {
                connectPX.push(j)
            }
            if (compareSides(sideNY, tileCompare.sidePY)) {
                connectNY.push(j)
            }
            if (compareSides(tileCompare.sideNY, sidePY)) {
                connectPY.push(j)
            }
            if (sideNZ === tileCompare.sidePZ) {
                connectNZ.push(j)
            }
            if (sidePZ === tileCompare.sideNZ) {
                connectPZ.push(j)
            }
        }
        tile.connectNX = connectNX
        tile.connectPX = connectPX
        tile.connectNY = connectNY
        tile.connectPY = connectPY
        tile.connectNZ = connectNZ
        tile.connectPZ = connectPZ
    }
}





export const createDataTiles = () => {
    const arrTiles = []
    arrTiles.push({
        keyModel: 'tile_EMPTY',
        rotationY: 0,
        sideNX: '_|_|_',
        sidePX: '_|_|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|_|_',
        sidePZ: '_|_|_',
    })

    //////////////////////////// gor
    arrTiles.push({
        keyModel: 'tile_I',
        rotationY: 0,
        sideNX: '_|_|_',
        sidePX: '_|_|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|1|_',
        sidePZ: '_|1|_',
    })
    arrTiles.push({
        keyModel: 'tile_I',
        rotationY: Math.PI / 2,
        sideNX: '_|1|_',
        sidePX: '_|1|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|_|_',
        sidePZ: '_|_|_',
    })
    arrTiles.push({
        keyModel: 'tile_X',
        rotationY: 0,
        sideNX: '_|1|_',
        sidePX: '_|1|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|1|_',
        sidePZ: '_|1|_',
    })
    arrTiles.push({
        keyModel: 'tile_L',
        rotationY: 0,
        sideNX: '_|_|_',
        sidePX: '_|1|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|_|_',
        sidePZ: '_|1|_',
    })
    arrTiles.push({
        keyModel: 'tile_L',
        rotationY: -Math.PI / 2,
        sideNX: '_|1|_',
        sidePX: '_|_|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|_|_',
        sidePZ: '_|1|_',
    })
    arrTiles.push({
        keyModel: 'tile_L',
        rotationY: Math.PI,
        sideNX: '_|1|_',
        sidePX: '_|_|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|1|_',
        sidePZ: '_|_|_',
    })
    arrTiles.push({
        keyModel: 'tile_L',
        rotationY: Math.PI / 2,
        sideNX: '_|_|_',
        sidePX: '_|1|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|1|_',
        sidePZ: '_|_|_',
    })

    arrTiles.push({
        keyModel: 'tile_T',
        rotationY: 0,
        sideNX: '_|_|_',
        sidePX: '_|1|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|1|_',
        sidePZ: '_|1|_',
    })
    arrTiles.push({
        keyModel: 'tile_T',
        rotationY: Math.PI / 2,
        sideNX: '_|1|_',
        sidePX: '_|1|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|1|_',
        sidePZ: '_|_|_',
    })
    arrTiles.push({
        keyModel: 'tile_T',
        rotationY: Math.PI,
        sideNX: '_|1|_',
        sidePX: '_|_|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|1|_',
        sidePZ: '_|1|_',
    })
    arrTiles.push({
        keyModel: 'tile_T',
        rotationY: Math.PI + Math.PI / 2,
        sideNX: '_|1|_',
        sidePX: '_|1|_',
        sideNY: '_|_|_',
        sidePY: '_|_|_',
        sideNZ: '_|_|_',
        sidePZ: '_|1|_',
    })



    //////////////////////////////////// top
    // arrTiles.push({
    //     keyModel: 'tile_X_BT',
    //     rotationY: 0,
    //     sideNX: '_|1|_',
    //     sidePX: '_|1|_',
    //     sideNY: '_|closed.NZ.PZ|_',
    //     sidePY: '_|NX.PX|_',
    //     sideNZ: '_|1|_',
    //     sidePZ: '_|1|_',
    // })
    // arrTiles.push({
    //     keyModel: 'tile_X_BT',
    //     rotationY: Math.PI / 2,
    //     sideNX: '_|1|_',
    //     sidePX: '_|1|_',
    //     sideNY: '_|closed.NX.PX|_',
    //     sidePY: '_|NZ.PZ|_',
    //     sideNZ: '_|1|_',
    //     sidePZ: '_|1|_',
    // })


    // arrTiles.push({
    //     keyModel: 'tile_H',
    //     rotationY: 0,
    //     sideNX: '_|_|_',
    //     sidePX: '_|_|_',
    //     sideNY: '_|_|_',
    //     sidePY: '_|1|_',
    //     sideNZ: '_|_|_',
    //     sidePZ: '_|_|_',
    // })

    arrTiles.push({
        keyModel: 'tile_H_toH',
        rotationY: 0,
        sideNX: '_|_|_',
        sidePX: '_|_|_',
        sideNY: '_|_|_',
        sidePY: '_|PZ|_',
        sideNZ: '_|_|_',
        sidePZ: '_|1|_',
    })
    arrTiles.push({
        keyModel: 'tile_H_toH',
        rotationY: Math.PI / 2,
        sideNX: '_|_|_',
        sidePX: '_|1|_',
        sideNY: '_|_|_',
        sidePY: '_|PX|_',
        sideNZ: '_|_|_',
        sidePZ: '_|_|_',
    })
    arrTiles.push({
        keyModel: 'tile_H_toH',
        rotationY: Math.PI,
        sideNX: '_|_|_',
        sidePX: '_|_|_',
        sideNY: '_|_|_',
        sidePY: '_|NZ|_',
        sideNZ: '_|1|_',
        sidePZ: '_|_|_',
    })
    arrTiles.push({
        keyModel: 'tile_H_toH',
        rotationY: Math.PI + Math.PI / 2,
        sideNX: '_|1|_',
        sidePX: '_|_|_',
        sideNY: '_|_|_',
        sidePY: '_|NX|_',
        sideNZ: '_|_|_',
        sidePZ: '_|_|_',
    })

    arrTiles.push({
        keyModel: 'tile_STAIRS',
        rotationY: 0,
        sideNX: '_|1|_',
        sidePX: '_|_|_',
        sideNY: '_|closed.NZ|_',
        sidePY: '_|PZ|_',
        sideNZ: '_|_|_',
        sidePZ: '_|_|_',
    })
    arrTiles.push({
        keyModel: 'tile_STAIRS',
        rotationY: Math.PI / 2,
        sideNX: '_|_|_',
        sidePX: '_|_|_',
        sideNY: '_|closed.NX|_',
        sidePY: '_|PX|_',
        sideNZ: '_|_|_',
        sidePZ: '_|1|_',
    })
    arrTiles.push({
        keyModel: 'tile_STAIRS',
        rotationY: Math.PI,
        sideNX: '_|_|_',
        sidePX: '_|1|_',
        sideNY: '_|closed.PZ|_',
        sidePY: '_|NZ|_',
        sideNZ: '_|_|_',
        sidePZ: '_|_|_',
    })


    arrTiles.push({
        keyModel: 'tile_B',
        rotationY: 0,
        sideNX: '_|_|_',
        sidePX: '_|_|_',
        sideNY: '_|closed.NZ|_',
        sidePY: '_|_|_',
        sideNZ: '_|1|_',
        sidePZ: '_|_|_',
    })
    arrTiles.push({
        keyModel: 'tile_B',
        rotationY: Math.PI / 2,
        sideNX: '_|1|_',
        sidePX: '_|_|_',
        sideNY: '_|closed.NX|_',
        sidePY: '_|_|_',
        sideNZ: '_|_|_',
        sidePZ: '_|_|_',
    })
    arrTiles.push({
        keyModel: 'tile_B',
        rotationY: Math.PI,
        sideNX: '_|_|_',
        sidePX: '_|_|_',
        sideNY: '_|closed.PZ|_',
        sidePY: '_|_|_',
        sideNZ: '_|_|_',
        sidePZ: '_|1|_',
    })
    arrTiles.push({
        keyModel: 'tile_B',
        rotationY: Math.PI + Math.PI / 2,
        sideNX: '_|_|_',
        sidePX: '_|1|_',
        sideNY: '_|closed.PX|_',
        sidePY: '_|_|_',
        sideNZ: '_|_|_',
        sidePZ: '_|_|_',
    })
    prepareConnectionTiles(arrTiles)
    return arrTiles
}
