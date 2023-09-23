import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import { M } from '../entities/structure/M'
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

    const arrTiles = createDataTiles()
    const v = []
    const uv = []
    const c = []
    for (let i = 0; i < arrTiles.length; ++i) {
        const data = TILES[arrTiles[i].keyModel]({})
        M.rotateVerticesY(data.v, arrTiles[i].rotationY)
        M.translateVertices(data.v, i * 3.1, 0, 0)
        v.push(...data.v)
        uv.push(...data.uv)
        c.push(...data.c)


    }
    const mesh = createMesh(v, uv, c, materials.brickColor)
    studio.addToScene(mesh)


    /** CUSTOM 00 **************************/
    {

    }
}


window.addEventListener('load', () => {
    initApp().then()
})
