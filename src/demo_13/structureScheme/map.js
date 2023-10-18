import { createMap3X } from './map3SHelper'
import { createMakerMesh } from './makerMesh'
//import { map3SArtifactsFilter } from './map3SArtefactsFilter'

// const button = document.createElement('button')
// button.innerText = 'NEXT'
// document.body.appendChild(button)
// button.style.position = 'absolute'
// button.style.zIndex = '100'
// button.style.top = '0'
// let f = null


const choiceFinalTileFromExists = (dataAction, map) => {
    const [y, z, x] = dataAction.src
    const mapItem = map[y][z][x]

    if (Number.isInteger(mapItem.resultTileIndex)) {
        return;
    }
    if (!mapItem.maybeTilesInds.length) {
        mapItem.resultTileIndex = -1
        mapItem.maybeTilesInds = []
        return;
    }

    const indTile = mapItem.maybeTilesInds[Math.floor(Math.random() * mapItem.maybeTilesInds.length)]
    mapItem.resultTileIndex = indTile
    mapItem.maybeTilesInds = [indTile]
}

const filterMaybeArrByCompare = (dataAction, map, tiles) => {
    const [y, z, x] = dataAction.src
    const [yWith, zWith, xWith] = dataAction.with
    const { withProp } = dataAction

    if (!map[y] || !map[y][z] || !map[y][z][x]) {
        return;
    }
    if (Number.isInteger(map[y][z][x].resultTileIndex)) {
        return;
    }

    if (!map[yWith] || !map[yWith][zWith] || !map[yWith][zWith][xWith]) {
        return;
    }


    const arrNotChange = map[yWith][zWith][xWith].maybeTilesInds
    const arrCurrent = map[y][z][x].maybeTilesInds

    if (!arrNotChange || !arrNotChange.length || !arrCurrent || !arrCurrent.length) {
        return;
    }

    const newArr = []
    for (let i = 0; i < arrNotChange.length; ++i) {
        const arrCanBe = tiles[arrNotChange[i]][withProp]
        for (let j = 0; j < arrCanBe.length; ++j) {
            for (let k = 0; k < arrCurrent.length; ++k) {
                if (arrCanBe[j] === arrCurrent[k]) {
                    newArr.push(arrCurrent[k])
                }
            }
        }
    }

    const filteredArr = []
    for (let i = 0; i < newArr.length; ++i) {
        let isIn = false
        for (let j = 0; j < filteredArr.length; ++j) {
            if (filteredArr[j] === newArr[i]) {
                isIn = true
            }
        }
        if (!isIn) {
            filteredArr.push(newArr[i])
        }
    }

    map[y][z][x].maybeTilesInds = filteredArr
}



const actionsWithMapItem = {
    choiceFinalTileFromExists,
    filterMaybeArrByCompare,
}




const createPipelineActionsWithMapItem = (y, z, x, map) => {
    const actions = [
        { action: 'choiceFinalTileFromExists', src: [y, z, x], },

        /** Z */
        { action: 'filterMaybeArrByCompare', src: [y, z - 1, x],  with: [y, z, x], withProp: 'connectNZ' },
        { action: 'filterMaybeArrByCompare', src: [y, z + 1, x], with: [y, z, x], withProp: 'connectPZ' },

        /** X */
        { action: 'filterMaybeArrByCompare', src: [y, z, x - 1], with: [y, z, x], withProp: 'connectNX'  },
        { action: 'filterMaybeArrByCompare', src: [y, z, x + 1], with: [y, z, x], withProp: 'connectPX'  },

        /** Z - 1, X - 1 */
        { action: 'filterMaybeArrByCompare', src: [y, z - 1, x - 1], with: [y, z - 1, x], withProp: 'connectNX'  },
        { action: 'filterMaybeArrByCompare', src: [y, z - 1, x - 1], with: [y, z, x - 1], withProp: 'connectNZ'  },

        /** Z - 1, X + 1 */
        { action: 'filterMaybeArrByCompare', src: [y, z - 1, x + 1], with: [y, z - 1, x], withProp: 'connectPX'  },
        { action: 'filterMaybeArrByCompare', src: [y, z - 1, x + 1], with: [y, z, x + 1], withProp: 'connectNZ'  },

        /** Z + 1, X + 1 */
        { action: 'filterMaybeArrByCompare', src: [y, z + 1, x + 1], with: [y, z, x + 1], withProp: 'connectPZ'  },
        { action: 'filterMaybeArrByCompare', src: [y, z + 1, x + 1], with: [y, z + 1, x], withProp: 'connectPX'  },

        /** Z + 1, X - 1 */
        { action: 'filterMaybeArrByCompare', src: [y, z + 1, x - 1], with: [y, z + 1, x], withProp: 'connectNX'  },
        { action: 'filterMaybeArrByCompare', src: [y, z + 1, x - 1], with: [y, z, x - 1], withProp: 'connectPZ'  },

        /** -- Y */

        /** ++Y with Y */
        { action: 'filterMaybeArrByCompare', src: [y + 1, z, x], with: [y, z, x], withProp: 'connectPY' },
        // /** Z + 1, Z - 1 */
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z - 1, x], with: [y, z - 1, x], withProp: 'connectPY' },
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z + 1, x], with: [y, z + 1, x], withProp: 'connectPY' },
        // /** X + 1, X - 1 */
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z, x - 1], with: [y, z, x - 1], withProp: 'connectPY' },
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z, x + 1], with: [y, z, x + 1], withProp: 'connectPY' },
        // /** X - 1, Z - 1 */
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z - 1, x - 1], with: [y, z - 1, x - 1], withProp: 'connectPY' },
        // /** X - 1, Z + 1 */
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z + 1, x - 1], with: [y, z + 1, x - 1], withProp: 'connectPY' },
        // /** X + 1, Z - 1 */
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z - 1, x + 1], with: [y, z - 1, x + 1], withProp: 'connectPY' },
        // /** X + 1, Z + 1 */
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z + 1, x + 1], with: [y, z + 1, x + 1], withProp: 'connectPY' },
        //
        // /** ++Y with ++Y */
        // /** X - 1 */
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z, x - 1], with: [y + 1, z, x], withProp: 'connectNX' },
        // /** X + 1 */
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z, x + 1], with: [y, z - 1, x], withProp: 'connectPX' },
        // /** Z - 1 */
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z - 1, x], with: [y + 1, z, x], withProp: 'connectNZ' },
        // /** Z + 1 */
        // { action: 'filterMaybeArrByCompare', src: [y + 1, z + 1, x], with: [y, z - 1, x], withProp: 'connectPZ' },
    ]

    return actions
}



export const createMap = (tiles, studio, materials) => {
    const make = createMakerMesh(materials)
    let map

    return {
        generateMap: (dataStructure) => {
            let maxCallStack = 30000

            return new Promise(res => {
                console.log('!!! tiles', tiles)
                /** create start map */

                createMap3X(tiles, dataStructure, studio).then(mapR => {
                    map = mapR
                    console.log('!!! map', map)

                    /** set existing tiles */
                    // const { mapFill } = dataStructure
                    // for (let i = 0; i < mapFill.length; ++i) {
                    //     const { place } = mapFill[i]
                    //     map.items[place[0]][place[1]][place[2]].resultTileIndex = 0
                    //     map.items[place[0]][place[1]][place[2]].maybeTilesInds = [0]
                    // }


                    /** pipeline actions with tile */
                    const pipelineActions = (y, z, x, map) => {
                        return new Promise(res => {
                            const actions = createPipelineActionsWithMapItem(y, z, x, map)
                            const iterateAction = (indAction) => {
                                if (!actions[indAction]) {
                                    return res();
                                }
                                const action = actions[indAction]
                                actionsWithMapItem[action.action](action, map.items, tiles)

                                // if (f) {
                                //     button.removeEventListener('click', f)
                                // }
                                // f = () => {
                                //     iterateAction(indAction + 1)
                                // }
                                // button.addEventListener('click', f)
                                //setTimeout(() => {iterateAction(indAction + 1)}, 0)
                                iterateAction(indAction + 1)
                            }
                            iterateAction(0)
                        })
                    }


                    const calculateMapItem = (y, z, x) => {
                        return new Promise((res, rej) => {
                            --maxCallStack
                            if (maxCallStack < 0) {
                                console.log('max stack:', maxCallStack )
                                return rej();
                            }

                            /** choice tile and filter neighbours */
                            pipelineActions(y, z, x, map).then(() => {
                                /** add mesh to scene */
                                console.log(map.items[y][z][x].resultTileIndex)
                                if (map.items[y][z][x].hasOwnProperty('resultTileIndex') && Number.isInteger(map.items[y][z][x].resultTileIndex)) {
                                    map.items[y][z][x].tileData = tiles[map.items[y][z][x].resultTileIndex]

                                    if (mapR.labels[`${ y }_${ z }_${ x }`].mesh) {
                                        studio.removeFromScene(mapR.labels[`${ y }_${ z }_${ x }`].mesh)
                                    }
                                    const m = make(map.items[y][z][x])
                                    m && studio.addToScene(m)
                                }
                                setTimeout(res, 15)
                            })
                        })
                    }

                    const nextItem = () => {
                        const {nextY, nextZ, nextX} = map.checkNextMapItemIndexes()
                        if (
                            Number.isInteger(nextY) &&
                            Number.isInteger(nextZ) &&
                            Number.isInteger(nextX)
                        ) {
                            calculateMapItem(nextY, nextZ, nextX).then(nextItem)
                            //setTimeout(() => {  }, 0)
                        } else {
                            res(map)
                        }
                    }

                    nextItem()
                })
            })
        },
        destroyMap: () => {
            for (let i = 0; i < map.items.length; ++i) {
                for (let j = 0; j < map.items[i].length; ++j) {
                    for (let k = 0; k < map.items[i][j].length; ++k) {
                        for (let key in map.items[i][j][k]) {
                            delete map.items[i][j][k][key]
                        }
                        delete map.items[i][j][k]
                    }
                    delete map.items[i][j]
                }
                delete map.items[i]
            }
            map = null
        },
    }
}
