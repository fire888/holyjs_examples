import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import { createColumnData } from '../entities/structure/arrElemColumn'
import { createPlatformData } from "../entities/structure/arrElemPlatform";
import { createElemArcData } from "../entities/structure/arrElemArc";

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


    /** CUSTOM 00 **************************/
    {
        const { v, uv, c } = createColumnData({})
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(.5, 0, 0)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c } = createPlatformData({
            nX_pZ: [-.3, 0, .3],
            pX_pZ: [.3, 0, .3],
            pX_nZ: [.3, 0, -.3],
            nX_nZ: [-.3, 0, -.3],
            minusH: -.1
        })
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(1, 0, 0)
        studio.addToScene(mesh)
    }
    {
        const { v, uv, c } = createElemArcData({ w: .5, h: .5, d: .25 })
        const mesh = createMesh(v, uv, c, materials.brickColor)
        mesh.position.set(0, 0, 0)
        studio.addToScene(mesh)
    }
}


window.addEventListener('load', () => {
    initApp().then()
})
