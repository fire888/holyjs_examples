import * as THREE from 'three'
import { W, H } from '../structure/constants'

const button = document.createElement('button')
button.innerText = 'NEXT'
document.body.appendChild(button)
button.style.position = 'absolute'
button.style.zIndex = '100'
button.style.top = '0'
let f = null

const geom = new THREE.BoxGeometry(.3, .3, .3)
const matRed = new THREE.MeshBasicMaterial({ color: 0xFF0000 })
const matYellow = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })

const makeQueue = (map, studio) => {
    return new Promise(res => {
        const sY = map.length
        const sZ = map[0].length
        const sX = map[0][0].length
        const m = {}
        for (let i = 0; i < map.length; ++i) {
            for (let j = 0; j < map[i].length; ++j) {
                for (let k = 0; k < map[i][j].length; ++k) {
                    m[i + '_' + j + '_' + k] = map[i][j][k]
                }
            }
        }

        let currentY = 0

        let indInsert = 0 /** was calculated by neighbour */
        let indComplete = 0 /** complete calculate around */
        const q = []

        const addToQueue = (i, j, k) => {
            if (m[`${ i }_${ j }_${ k }`] && !m[`${ i }_${ j }_${ k }`].queue) {
                const mesh = new THREE.Mesh(geom, matYellow)
                mesh.position.set(k * W, i * H, j * W)
                studio.addToScene(mesh)

                q.push([i, j, k])
                ++indInsert
                m[`${ i }_${ j }_${ k }`].queue = { ind: indInsert, mesh }
            }
        }

        const iterate = (i, j, k) => {
            if (!m[`${ i }_${ j }_${ k }`]) {
                return;
            }
            addToQueue(i, j, k)
            ++indComplete
            if (m[`${ i }_${ j }_${ k }`].queue && m[`${ i }_${ j }_${ k }`].queue.mesh) {
                studio.removeFromScene(m[`${ i }_${ j }_${ k }`].queue.mesh)
                const mesh = new THREE.Mesh(geom, matRed)
                mesh.position.set(k * W, i * H, j * W)
                studio.addToScene(mesh)
                m[`${ i }_${ j }_${ k }`].queue.mesh = mesh
            }


            /** current floor */
            addToQueue(i, j, k + 1)
            addToQueue(i, j, k - 1)
            addToQueue(i, j + 1, k)
            addToQueue(i, j - 1, k)
            addToQueue(i, j + 1, k + 1)
            addToQueue(i, j - 1, k + 1)
            addToQueue(i, j + 1, k - 1)
            addToQueue(i, j - 1, k - 1)
            /** next floor */
            addToQueue(i + 1, j, k + 1)
            addToQueue(i + 1, j, k - 1)
            addToQueue(i + 1, j + 1, k)
            addToQueue(i + 1, j - 1, k)
            addToQueue(i + 1, j + 1, k + 1)
            addToQueue(i + 1, j - 1, k + 1)
            addToQueue(i + 1, j + 1, k - 1)
            addToQueue(i + 1, j - 1, k - 1)

            if (f) {
            //    button.removeEventListener('click', f)
            }
            f = () => {
                if (q[indComplete + 1]) {
                    iterate(...q[indComplete + 1])
                } else {
                    currentY += 1
                    if (currentY === sY) {
                        console.log('!!!!', sY)
                        res(q)
                        return
                    }
                    iterate(currentY, Math.floor(sZ / 2), Math.floor(sX / 2))
                }
            }
            //button.addEventListener('click', f)
            setTimeout(f, 30)
        }
        iterate(currentY, Math.floor(sZ / 2), Math.floor(sX / 2))

    })
}



export const createMap3X = (tiles, dataStructure, studio) => {
    return new Promise(res => {
        const { SIZE_X, SIZE_Y, SIZE_Z } = dataStructure

        const arrY = []
        for (let i = 0; i < SIZE_Y; ++i) {
            const arrZ = []
            for (let j = 0; j < SIZE_Z; ++j) {
                const arrX = []
                for (let k = 0; k < SIZE_X; ++k) {
                    const s = []
                    tiles.map((item, index) => { s.push(index) })
                    arrX.push({
                        resultTileIndex: null,
                        maybeTilesInds: s,
                        i,
                        j,
                        k,
                        numY: i,
                        numZ: j,
                        numX: k,
                    })
                }
                arrZ.push(arrX)
            }
            arrY.push(arrZ)
        }


        //const queue = makeQueue(arrY, SIZE_X, SIZE_Y, SIZE_Z, studio)
        makeQueue(arrY, studio).then(queue  => {
            console.log('queue', queue)
            let ind = 0

            res({
                sizeZ: SIZE_Z,
                sizeY: SIZE_Y,
                sizeX: SIZE_X,
                items: arrY,
                checkNextMapItemIndexes: (y, z, x) => {
                    if (queue[ind]) {
                        const next = queue[ind]
                        ++ind
                        return { nextY: next[0], nextZ: next[1], nextX: next[2] }
                    } else {
                        return { nextY: null, nextZ: null, nextX: null }
                    }
                },
                iterateAll: (f) => {
                    for (let i = 0; i < SIZE_Y; ++i) {
                        for (let j = 0; j < SIZE_Z; ++j) {
                            for (let k = 0; k < SIZE_X; ++k) {
                                f(arrY[i][j][k])
                            }
                        }
                    }
                }
            })
        })
    })
}
