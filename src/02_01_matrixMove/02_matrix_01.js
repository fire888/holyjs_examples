import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import { updateEveryFrame } from "../helpers/frameUpdater";

const { sin, cos } = Math

async function initApp () {
    const studio = createStudio()
    updateEveryFrame(studio.render)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    const materials = {
        'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}),
        'brick': new THREE.MeshBasicMaterial({color: 0xFFFFFF, map: assets.mapBrickDiff, side: THREE.DoubleSide}),
    }

    const rotateAndTranslate = (arr, angle, x, y, z) => {
        const v3 = new THREE.Vector3()
        const applyMatrixToArray = (m, arr) => {
            for (let i = 0; i < arr.length; i += 3) {
                v3.fromArray(v, i)
                v3.applyMatrix4(m)
                arr[i] = v3.x
                arr[i + 1] = v3.y
                arr[i + 2] = v3.z
            }
        }

        const m4rot = new THREE.Matrix4().makeRotationY(angle)
        const m4translate = new THREE.Matrix4().makeTranslation(x, y, z)

        applyMatrixToArray(m4rot, v)
        applyMatrixToArray(m4translate, v)
    }

    const v = [
        0, 0, 0,
        1, 0, 0,
        1, 2, 0,

        0, 0, 0,
        1, 2, 0,
        0, 2, 0,
    ]

    rotateAndTranslate(v, .15, .5, 0, 0)

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

    updateEveryFrame(() => {
        // rotateAndTranslate(v, 0.01, 0.01, 0, 0.01)
        // v.forEach((elem, i) => geometry.attributes.position.array[i] = elem)
        // geometry.attributes.position.needsUpdate = true
    })

    /** *******************************************/
}


window.addEventListener('load', () => {
    initApp().then()
})
