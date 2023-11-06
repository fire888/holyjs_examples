import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { createLoadManager } from '../helpers/loadManager'
import { Player } from "../helpers/player";
import { ASSETS_TO_LOAD } from './ASSETS'
import { M } from './structure/M'
import { W, H } from './structure/constants'
import { TILES } from "./tilesGeometry/TILES";
import { createDataTiles } from './structure/dataTiles'
import { generateStructureScheme } from './structureScheme/structureScheme'
import { createBoxesLines } from './helpersMeshes/gabaritesLines'
import { updateEveryFrame } from "../helpers/frameUpdater";
import {createLabel} from "./helpersMeshes/label";

const button = document.createElement('button')
button.innerText = 'WALK'
document.body.appendChild(button)
button.style.position = 'absolute'
button.style.zIndex = '100'
button.style.top = '0'
let f = null



const createMesh = (v, uv, c, material) => {
    const geometry = new THREE.BufferGeometry()
    const vF32 = new Float32Array(v)
    geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    geometry.computeVertexNormals()
    const uvF32 = new Float32Array(uv)
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
    const cF32 = new Float32Array(c)
    geometry.setAttribute('color', new THREE.BufferAttribute(cF32, 3))
    return new THREE.Mesh(geometry, material)
}


async function initApp () {
    const studio = createStudio(3)
    studio.setCamPos(10, 15, 23)
    studio.setCamTargetPos(10, 0, 5)
    updateEveryFrame(studio.render)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    const materials = {
        'brickColor': new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: assets.structureMap,
            bumpMap: assets.structureMap,
            bumpScale: .02,
            vertexColors: true,
        }),
        'simple': new THREE.MeshPhongMaterial({
            color: 0xFF3333,
            transparent: true,
            opacity: .8,
        })
    }

    //const { arrTiles, resultTiles } = createDataTiles([3, 7, 5, 9, 4, 6, 1])
    const { arrTiles, resultTiles } = createDataTiles([4,5,6])
    //const { arrTiles, resultTiles } = createDataTiles([0, 1])
    //const { arrTiles, resultTiles } = createDataTiles([3])
    //const { arrTiles, resultTiles } = createDataTiles([4, 5, 6, 7])
    //const { arrTiles, resultTiles } = createDataTiles([5, 6, 7])
    //const { arrTiles, resultTiles } = createDataTiles([4, 5, 6, 7, 9])
    //const { arrTiles, resultTiles } = createDataTiles([4, 5, 6, 7, 8])
    //const { arrTiles, resultTiles } = createDataTiles([4, 5, 6, 7, 8, 1, 2])
    //const { arrTiles, resultTiles } = createDataTiles([ 0, 4, 5, 6, 7, 8, 1, 2])
    //const { arrTiles, resultTiles } = createDataTiles([8, 9, 10, 11, 3])
    //const { arrTiles, resultTiles } = createDataTiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])



    const dataForMap = {
        numW: 9,
        numH: 1,
        numD: 6,
        tileW: W,
        tileH: H,
        tileD: W,
        tiles: resultTiles,
    }

    const l = createBoxesLines(W, H, W, dataForMap.numW, dataForMap.numH, dataForMap.numD)
    l.position.set(-W / 2, 0, -W / 2)
    studio.addToScene(l)

    generateStructureScheme(dataForMap, studio, materials).then(result => {
        const v = []
        const uv = []
        const c = []

        const vCollision = []

        result.iterateAll(item => {
            const { numX, numY, numZ, tileData } = item
            if (tileData) {
                const elem = TILES[tileData.keyModel]({})
                M.rotateVerticesY(elem.v, tileData.rotationY)
                M.translateVertices(elem.v, numX * W, numY * H, numZ * W)
                v.push(...elem.v)
                uv.push(...elem.uv)
                c.push(...elem.c)

                M.rotateVerticesY(elem.col, tileData.rotationY)
                M.translateVertices(elem.col, numX * W, numY * H + .1, numZ * W)
                vCollision.push(...elem.col)
            }
        })

        const meshCollision = createMesh(vCollision, uv, c, materials.simple)
        meshCollision.visible = false
        studio.addToScene(meshCollision)

        /** player *****************/
        let isPlayer = false
        let player = null
        const f = (e) => {
            e.preventDefault()
            e.stopPropagation()

            if (!isPlayer) {
                if (!player) {
                    player = new Player(
                        dataForMap.numW * W / 2,
                        dataForMap.numH * H / 2 + 1,
                        dataForMap.numD * W / 2,
                        [meshCollision]
                    )
                    updateEveryFrame(player.update.bind(player))
                }
                isPlayer = true
                player.enable()
                studio.setCam(player)
            } else {
                isPlayer = false
                player.disable()
                studio.enableControls()
            }


        }
        button.addEventListener("click", f)

        /** view tiles ********************/
        for (let i = 0; i < arrTiles.length; ++i) {
            const v = []
            const uv = []
            const c = []

            if (arrTiles[i].keyModel) {
                const elem = TILES[arrTiles[i].keyModel]({})
                M.rotateVerticesY(elem.v, arrTiles[i].rotationY)
                M.translateVertices(elem.v, (W + .1) * i, 0, -9)
                v.push(...elem.v)
                uv.push(...elem.uv)
                c.push(...elem.c)
                const label = createLabel(i, '#ff0000', 3)
                label.position.set((W + .1) * i, 2.5, -9)
                studio.addToScene(label)
            }

            const mesh = createMesh(v, uv, c, materials.brickColor)
            studio.addToScene(mesh)
        }

        for (let i = 0; i < resultTiles.length; ++i) {
            const v = []
            const uv = []
            const c = []

            if (resultTiles[i].keyModel) {
                const elem = TILES[resultTiles[i].keyModel]({})
                M.rotateVerticesY(elem.v, resultTiles[i].rotationY)
                M.translateVertices(elem.v, (W + .1) * i, 0, -5)
                v.push(...elem.v)
                uv.push(...elem.uv)
                c.push(...elem.c)
            }

            const mesh = createMesh(v, uv, c, materials.brickColor)
            studio.addToScene(mesh)
        }
    })
}


window.addEventListener('load', () => {
    initApp().then()
})
