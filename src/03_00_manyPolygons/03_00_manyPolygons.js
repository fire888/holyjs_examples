import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { updateEveryFrame } from "../helpers/frameUpdater";
import map from "../assets/map_brick_diff.jpg";

const { sin, cos } = Math


const createPolygon = (v0, v1, v2, v3) => {
    return {
        v: [...v0, ...v1, ...v2, ...v0, ...v2, ...v3],
        uv: [ 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1 ],
    }
}

const applyMatrixToArray = (m, arr) => {
    const v3 = new THREE.Vector3()
    for (let i = 0; i < arr.length; i += 3) {
        v3.fromArray(arr, i)
        v3.applyMatrix4(m)
        arr[i] = v3.x
        arr[i + 1] = v3.y
        arr[i + 2] = v3.z
    }
}

const translateVertices = (v, x, y, z) => {
    const m4 = new THREE.Matrix4().makeTranslation(x, y, z)
    applyMatrixToArray(m4, v)
}

const rotateVerticesY = (v, angle) => {
    const m4 = new THREE.Matrix4().makeRotationY(angle)
    applyMatrixToArray(m4, v)
}

const createMesh = (v, uv, material) => {
    const geometry = new THREE.BufferGeometry()
    const vF32 = new Float32Array(v)
    geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    const uvF32 = new Float32Array(uv)
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))

    return new THREE.Mesh(geometry, material)
}



async function initApp () {
    const studio = createStudio()
    studio.showGrid()
    studio.setBackColor(0x333333)
    updateEveryFrame(studio.render)
    const materials = {
        'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}),
        'brick': new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            map: new THREE.TextureLoader().load(map),
            side: THREE.DoubleSide
        }),
    }
    
    /** CUSTOM 00 **************************/

    const poly4 = createPolygon([0, 0, 0], [1, 0, 0], [1, 2, 0], [0, 2, 0])

    const v = []
    const uv = []

    const N = 10
    for (let i = 0; i < N; ++i) {
        const copyV = [...poly4.v]
        translateVertices(copyV, -.5, 0, 2)
        rotateVerticesY(copyV, i / N * Math.PI * 2)
        v.push(...copyV)
        uv.push(...poly4.uv)
    }

    const mesh = createMesh(v, uv, materials.brick)
    studio.addToScene(mesh)
}


window.addEventListener('load', () => {
    initApp().then()
})
