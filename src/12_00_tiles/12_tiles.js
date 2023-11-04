import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from './ASSETS'
import { createColumnData } from './structure/elemColumn'
import { createPlatformData } from "./structure/elemPlatform";
import { createElemArcData } from "./structure/elemArc";
import { tile_I } from './structure/tile_I'
import { tile_X } from './structure/tile_X'
import { tile_L } from './structure/tile_L'
import { tile_X_BT } from './structure/tile_X_BT'
import { tile_H } from './structure/tile_H'
import { tile_H_toH } from './structure/tile_H_toH'
import { tile_T } from './structure/tile_T'
import { tile_STAIRS } from './structure/tile_STAIRS'
import { tile_B } from './structure/tile_B'

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
            color: 0xFF4444,
            transparent: true,
            opacity: .8,
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


    /** CUSTOM 00 **************************/
    {
        const { v, uv, c, col } = createElemArcData({})
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(0, 0, 0)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = createColumnData({})
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(1, 0, 0)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = createPlatformData({})
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(2, 0, 0)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = tile_I()
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(0, 0, - 3)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = tile_X()
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(3, 0, - 3)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = tile_L()
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(5.5, 0, - 3)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = tile_X_BT()
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(9.2, 0, - 3)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = tile_H()
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(12.4, 0, - 3)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = tile_H_toH()
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(14.5, 0, - 3)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = tile_T()
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(16.5, 0, - 3)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = tile_STAIRS()
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(20, 0, - 3)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c, col } = tile_B()
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(23, 0, - 3)
        studio.addToScene(mesh)
    }

    /** HIDDEN GEOM ******************************/
    // {
    //     const { v, uv, c, col } = createElemArcData({})
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(0, .1, 0)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = createColumnData({})
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(1, .1, 0)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = createPlatformData({})
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(2, .1, 0)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = tile_I()
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(0, .1, -3)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = tile_X()
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(3, .1, -3)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = tile_L()
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(5.5, .1, -3)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = tile_X_BT()
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(9.2, .1, -3)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = tile_H()
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(12.demo_14, .1, -3)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = tile_H_toH()
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(14.5, .1, -3)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = tile_T()
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(16.5, .1, -3)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = tile_STAIRS()
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(20, .1, -3)
    //     studio.addToScene(mesh2)
    // }
    // {
    //     const { v, uv, c, col } = tile_B()
    //     const mesh2 = createMesh(col, uv, c, materials.simple)
    //     mesh2.position.set(23, .1, -3)
    //     studio.addToScene(mesh2)
    // }
}


window.addEventListener('load', () => {
    initApp().then()
})
