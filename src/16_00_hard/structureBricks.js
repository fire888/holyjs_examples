import * as THREE from "three";
import { createStudio } from './studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from './ASSETS'
import { M } from './structureBricks/M'
import { W, H } from './structureBricks/constants'
import { tile_I } from './structureBricks/tile_I'
import { tile_X } from './structureBricks/tile_X'
import { tile_L } from './structureBricks/tile_L'
import { tile_X_BT } from './structureBricks/tile_X_BT'
import { tile_H } from './structureBricks/tile_H'
import { tile_H_toH } from './structureBricks/tile_H_toH'
import { tile_T } from './structureBricks/tile_T'
import { tile_STAIRS } from './structureBricks/tile_STAIRS'
import { tile_B } from './structureBricks/tile_B'
import { tile_EMPTY } from './structureBricks/tile_EMPTY'
import { createDataTiles } from './structureBricks/dataTiles'
import { generateStructureScheme } from './structureScheme/structureScheme'
import { Player } from "../helpers/player";
import { tile_ElemsTop } from './structureBricks/tile_ElemsTop'
import { updateEveryFrame } from "../helpers/frameUpdater"

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
    studio.render()
    studio.setCamPos(10, 10, 10)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    const materials = {
        'brickColor': new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: assets.mapStructureBrickDiff,
            bumpMap: assets.mapStructureBrickDiff,
            bumpScale: .02,
            vertexColors: true,
        }),
        'simple': new THREE.MeshPhongMaterial({
            color: 0xFF3333,
            transparent: true,
            opacity: .8,
        }),
        'panorama': new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: assets.pan,
            side: THREE.DoubleSide,
            fog: false,
        })
    }



    const arrTiles = createDataTiles()
    const dataForMap = {
        numW: 7,
        numH: 10,
        numD: 7,
        tileW: W,
        tileH: H,
        tileD: W,
        tiles: arrTiles,
    }

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(50),
        materials.panorama
    )
    studio.addToScene(sphere)
    sphere.position.set(dataForMap.numW * W / 2,dataForMap.numH * H / 2, dataForMap.numD * W / 2)

    // const l = createBoxesLines(W, H, W, dataForMap.numW, dataForMap.numH, dataForMap.numD)
    // l.position.set(-W / 2, 0, -W / 2)
    // studio.addToScene(l)

    generateStructureScheme(dataForMap, studio, materials).then(result => {
        const v = []
        const uv = []
        const c = []

        const vCollision = []

        result.iterateAll(item => {
            const { numX, numY, numZ, tileData } = item
            if (!tileData) {
                return
            }
            const elem = TILES[tileData.keyModel]({})
            M.rotateVerticesY(elem.v, tileData.rotationY)
            M.translateVertices(elem.v, numX * W, numY * H, numZ * W)
            v.push(...elem.v)
            uv.push(...elem.uv)
            c.push(...elem.c)

            M.rotateVerticesY(elem.col, tileData.rotationY)
            M.translateVertices(elem.col, numX * W, numY * H + .1, numZ * W)
            vCollision.push(...elem.col)


            if (
                tileData.keyModel === 'tile_B'
            ) {
                return;
            }

            if (
                tileData.keyModel === 'tile_EMPTY'
            ) {
                if (
                    result.items[numY - 1] &&
                    result.items[numY - 1][numZ][numX].tileData.keyModel !== 'tile_EMPTY' &&
                    result.items[numY - 1][numZ][numX].tileData.keyModel !== 'tile_B'
                ) {
                    const elemT = tile_ElemsTop({})
                    M.translateVertices(elemT.v, numX * W, numY * H, numZ * W)
                    v.push(...elemT.v)
                    uv.push(...elemT.uv)
                    c.push(...elemT.c)
                }
            }


            if (
                numY !== dataForMap.numH - 1
            ) {
                return;
            }
            if (tileData.keyModel === 'tile_EMPTY') {
                return;
            }
            const elemT = tile_ElemsTop({})
            M.translateVertices(elemT.v, numX * W, numY * H + H, numZ * W)
            v.push(...elemT.v)
            uv.push(...elemT.uv)
            c.push(...elemT.c)

        })

        const mesh = createMesh(v, uv, c, materials.brickColor)
        studio.addToScene(mesh)

        const meshCollision = createMesh(vCollision, uv, c, materials.simple)
        meshCollision.visible = false
        studio.addToScene(meshCollision)

        const player = new Player(6, 5, 6, [meshCollision])
        studio.setCam(player)
        updateEveryFrame(studio.render)
        updateEveryFrame(() => { player.update() })
        let isPlayer = true
        const f = (e) => {
            e.preventDefault()
            e.stopPropagation()

            if (!isPlayer) {
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
    })
}


window.addEventListener('load', () => {
    initApp().then()
})
