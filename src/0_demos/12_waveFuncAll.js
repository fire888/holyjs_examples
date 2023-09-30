import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import { M } from '../entities/structure/M'
import { W, H } from '../entities/structure/constants'
import { tile_I } from '../entities/structure/tile_I'
import { tile_X } from '../entities/structure/tile_X'
import { tile_L } from '../entities/structure/tile_L'
import { tile_X_BT } from '../entities/structure/tile_X_BT'
import { tile_H } from '../entities/structure/tile_H'
import { tile_H_toH } from '../entities/structure/tile_H_toH'
import { tile_T } from '../entities/structure/tile_T'
import { tile_STAIRS } from '../entities/structure/tile_STAIRS'
import { tile_B } from '../entities/structure/tile_B'
import { tile_EMPTY } from '../entities/structure/tile_EMPTY'
import { createDataTiles } from '../entities/structure/dataTiles'
import { generateStructureScheme } from '../entities/structureScheme12/structureScheme'
import { Player } from "../entities/player";
import { createBoxesLines } from '../entities/structure/gabarites'

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

    const l = createBoxesLines(W, H, W, 7, 10, 7)
    studio.addToScene(l)

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
    generateStructureScheme(dataForMap, studio).then(result => {
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
        meshCollision.visible = false
        studio.addToScene(meshCollision)

        const player = new Player(6, 5,6, [meshCollision])
        studio.setCam(player)
        updateFunctions.push(() => { player.update() })
    })
}


window.addEventListener('load', () => {
    initApp().then()
})
