import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import {translateArr} from "../helpers/geomHelpers";

const { sin, cos } = Math

async function initApp () {
    const studio = createStudio()
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    const materials = {
        'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}),
        'brick': new THREE.MeshBasicMaterial({color: 0xFFFFFF, map: assets.mapBrickDiff, side: THREE.DoubleSide}),
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


    const v = [
        0, 0, 0,
        1, 0, 0,
        1, 2, 0,

        0, 0, 0,
        1, 2, 0,
        0, 2, 0,
    ]

    /** CUSTOM 04_01 ***********************************/

    const m4rot = new THREE.Matrix4().makeRotationY(1.3)
    const m4x = new THREE.Matrix4().makeTranslation(-3, 0, 0)
    const m4z = new THREE.Matrix4().makeTranslation(0, 0, -3)

    // const v3 = new THREE.Vector3()
    // const applyMatrixToArray = (m, arr) => {
    //     for (let i = 0; i < arr.length; i += 3) {
    //         v3.fromArray(v, i)
    //         v3.applyMatrix4(m)
    //         arr[i] = v3.x
    //         arr[i + 1] = v3.y
    //         arr[i + 2] = v3.z
    //     }
    // }
    //
    // applyMatrixToArray(m4rot, v)
    // applyMatrixToArray(m4x, v)
    // applyMatrixToArray(m4z, v)

    /** ************************************************/


    /** CUSTOM 04_01 ***********************************/

    // const rotateAndTranslate = (arr, angle, x, y, z) => {
    //     const v3 = new THREE.Vector3()
    //     const applyMatrixToArray = (m, arr) => {
    //         for (let i = 0; i < arr.length; i += 3) {
    //             v3.fromArray(v, i)
    //             v3.applyMatrix4(m)
    //             arr[i] = v3.x
    //             arr[i + 1] = v3.y
    //             arr[i + 2] = v3.z
    //         }
    //     }
    //
    //     const m4rot = new THREE.Matrix4().makeRotationY(angle)
    //     const m4translate = new THREE.Matrix4().makeTranslation(x, y, z)
    //
    //     applyMatrixToArray(m4rot, v)
    //     applyMatrixToArray(m4translate, v)
    // }

    /** ************************************************/


    const uv = [
        0, 0,
        1, 0,
        1, 1,

        0, 0,
        1, 1,
        0, 1,
    ]

    const geometry = new THREE.BufferGeometry()
    const vF32 = new Float32Array(v)
    geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    const uvF32 = new Float32Array(uv)
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))

    const mesh = new THREE.Mesh(geometry, materials.brick)
    studio.addToScene(mesh)

    updateFunctions.push(() => {
        //rotateAndTranslate(v, 0.01, 0.01, 0, 0.01)
        //v.forEach((elem, i) => geometry.attributes.position.array[i] = elem)
        //geometry.attributes.position.needsUpdate = true
    })

    /** *******************************************/
}


window.addEventListener('load', () => {
    initApp().then()
})
