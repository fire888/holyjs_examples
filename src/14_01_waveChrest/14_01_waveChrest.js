import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { createLoadManager } from '../helpers/loadManager'
import { Player } from "../helpers/player";
import { ASSETS_TO_LOAD } from './ASSETS'
import { M } from './structure/M'
import { W, H } from './structure/constants'
import { tile_I } from './structure/tile_I'
import { tile_X } from './structure/tile_X'
import { tile_L } from './structure/tile_L'
import { tile_X_BT } from './structure/tile_X_BT'
import { tile_H } from './structure/tile_H'
import { tile_H_toH } from './structure/tile_H_toH'
import { tile_T } from './structure/tile_T'
import { tile_STAIRS } from './structure/tile_STAIRS'
import { tile_B } from './structure/tile_B'
import { tile_EMPTY } from './structure/tile_EMPTY'
import { createDataTiles } from './structure/dataTiles'
import { generateStructureScheme } from './structureScheme/structureScheme'
import { createBoxesLines } from './structure/gabarites'
import { updateEveryFrame } from "../helpers/frameUpdater";
import {createLabel} from "./structure/label";

const button = document.createElement('button')
button.innerText = 'WALK'
document.body.appendChild(button)
button.style.position = 'absolute'
button.style.zIndex = '100'
button.style.top = '0'
let f = null


const TILES = {
    tile_I,
    tile_X,
    tile_L,
    tile_X_BT,
    tile_H,
    tile_H_toH,
    tile_T,
    tile_STAIRS,
    tile_B,
    tile_EMPTY,
}



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
    studio.setCamPos(10, 10, 10)
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

    const arrTiles = createDataTiles()
    //const indexesUse  = [0, 1]
    //const indexesUse  = [0, 3, 4, 5, 6]
    const indexesUse  = [8, 9, 10]
    const useTiles = arrTiles.filter((elemTile, ind) => {
        let isUse = false
        indexesUse.forEach(elemIndex => {
            if (ind === elemIndex) {
                isUse = true
            }
        })
        return isUse
    })

    const dataForMap = {
        numW: 9,
        numH: 2,
        numD: 6,
        tileW: W,
        tileH: H,
        tileD: W,
        tiles: useTiles,
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
                        dataForMap.numH * H / 2,
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
                M.translateVertices(elem.v, (W + .1) * i, 0, -5)
                v.push(...elem.v)
                uv.push(...elem.uv)
                c.push(...elem.c)
                const label = createLabel(i, '#ff0000', 3)
                label.position.set((W + .1) * i, 1, -5)
                studio.addToScene(label)
            }

            const mesh = createMesh(v, uv, c, materials.brickColor)
            studio.addToScene(mesh)
        }
    })
}


window.addEventListener('load', () => {
    initApp().then()
})
