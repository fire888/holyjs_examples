import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../entities/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import { M } from '../demo_13/structure/M'
import { W, H } from '../demo_13/structure/constants'
import { tile_I } from '../demo_13/structure/tile_I'
import { tile_X } from '../demo_13/structure/tile_X'
import { tile_L } from '../demo_13/structure/tile_L'
import { tile_X_BT } from '../demo_13/structure/tile_X_BT'
import { tile_H } from '../demo_13/structure/tile_H'
import { tile_H_toH } from '../demo_13/structure/tile_H_toH'
import { tile_T } from '../demo_13/structure/tile_T'
import { tile_STAIRS } from '../demo_13/structure/tile_STAIRS'
import { tile_B } from '../demo_13/structure/tile_B'
import { tile_EMPTY } from '../demo_13/structure/tile_EMPTY'
import { createDataTiles } from '../demo_13/structure/dataTiles'
import { createLabel } from '../demo_13/structure/label'
import { createBoxesLines } from '../demo_13/structure/gabarites'
import { generateStructureScheme } from '../entities/structureSheme/structureScheme'
import {Player} from "../entities/player";

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
    const updateFunctions = []
    let n = 0
    const animate = () => {
        requestAnimationFrame(animate)
        n += .014
        updateFunctions.forEach(fn => fn(n))
        studio.render()
    }
    animate()

    const offset = W * 1.5

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
    generateStructureScheme(dataForMap).then(result => {
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

        const mesh = createMesh(v, uv, c, materials.brickColor)
        studio.addToScene(mesh)

        const meshCollision = createMesh(vCollision, uv, c, materials.simple)
        studio.addToScene(meshCollision)

        const player = new Player(6, 5,6, [meshCollision])
        studio.setCam(player)
        updateFunctions.push(() => { player.update() })
    })
}


window.addEventListener('load', () => {
    initApp().then()
})