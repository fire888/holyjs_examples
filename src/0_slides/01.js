import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'

const { sin, cos } = Math

async function initApp () {
    const studio = createStudio()
    const loadManager = createLoadManager()
    const assets = await loadManager.startLoad(ASSETS_TO_LOAD)
    const materials = {
        'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}),
        'brick': new THREE.MeshBasicMaterial({color: 0xFFFFFF, map: assets.mapBrickDiff}),
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


    /** CUSTOM 00_00 ***********************************/
    {

        const v = [
            0, 0, 0,
            1, 0, 0,
            1, 2, 0,

            -.1, 0, 0,
            1, 2.1, 0,
            0, 2, 0,
        ]

        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))

        const mesh = new THREE.Mesh(geometry, materials.simple)
        studio.addToScene(mesh)

        updateFunctions.push(n => {
            // geometry.attributes.position.array[0] = sin(n * 5)
            // geometry.attributes.position.array[9] = sin(n * 5) // - .1
            geometry.attributes.position.needsUpdate = true
        })
    }

    /** CUSTOM 00_01 ***********************************/
    // {
    //     const v = [
    //         0, 0, 0,
    //         1, 0, 0,
    //         1, 2, 0,
    //
    //         0, 0, 0,
    //         1, 2, 0,
    //         0, 2, 0,
    //     ]
    //
    //     const uv = [
    //         0, 0,
    //         1, 0,
    //         1, 1,
    //
    //         0, 0,
    //         1, 1,
    //         0, 1,
    //     ]
    //
    //     const geometry = new THREE.BufferGeometry()
    //     const vF32 = new Float32Array(v)
    //     geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    //     const uvF32 = new Float32Array(uv)
    //     geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
    //
    //     const mesh = new THREE.Mesh(geometry, materials.brick)
    //     mesh.position.x = 1.2
    //     studio.addToScene(mesh)
    //
    //     updateFunctions.push(n => {
    //         // const v = .01
    //         // geometry.attributes.uv.array[0] += v
    //         // geometry.attributes.uv.array[2] += v
    //         // geometry.attributes.uv.array[4] += v
    //         // geometry.attributes.uv.array[6] += v
    //         // geometry.attributes.uv.array[8] += v
    //         // geometry.attributes.uv.array[10] += v
    //         // geometry.attributes.uv.array[12] += v
    //
    //         // const v = sin(n * 5) * .01
    //         // geometry.attributes.uv.array[0] += v
    //         // geometry.attributes.uv.array[2] += v
    //         // geometry.attributes.uv.array[4] += v
    //         // geometry.attributes.uv.array[6] += v
    //         // geometry.attributes.uv.array[8] += v
    //         // geometry.attributes.uv.array[10] += v
    //         // geometry.attributes.uv.array[12] += v
    //
    //         geometry.attributes.uv.needsUpdate = true
    //     })
    // }

    /** *******************************************/
}


window.addEventListener('load', () => {
    initApp().then()
})
