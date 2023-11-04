import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { updateEveryFrame } from "../helpers/frameUpdater"
import map from "../assets/map_brick_diff.jpg";

const { sin, cos } = Math

async function initApp () {
    const studio = createStudio()
    updateEveryFrame(studio.render)
    const materials = {
        'brick': new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            map: new THREE.TextureLoader().load(map),
            side: THREE.DoubleSide
        }),
    }


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
    const m4x = new THREE.Matrix4().makeTranslation(0, 0, 0)
    const m4z = new THREE.Matrix4().makeTranslation(0, 0, -.5)

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

    applyMatrixToArray(m4rot, v)
    applyMatrixToArray(m4x, v)
    applyMatrixToArray(m4z, v)

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

    /** *******************************************/
}


window.addEventListener('load', () => {
    initApp().then()
})
