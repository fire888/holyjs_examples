import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import {translateArr} from "../helpers/geomHelpers";

const { sin, cos, PI } = Math
const PI2 = PI * 2

const m = {
    createPolygon(v0, v1, v2, v3) {
        return {
            v: [...v0, ...v1, ...v2, ...v0, ...v2, ...v3],
            uv: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
        }
    },
    applyMatrixToArray(m, arr) {
        const v3 = new THREE.Vector3()
        for (let i = 0; i < arr.length; i += 3) {
            v3.fromArray(arr, i)
            v3.applyMatrix4(m)
            arr[i] = v3.x
            arr[i + 1] = v3.y
            arr[i + 2] = v3.z
        }
    },
    translateVertices(v, x, y, z) {
        const m4 = new THREE.Matrix4().makeTranslation(x, y, z)
        this.applyMatrixToArray(m4, v)
    },
    rotateVerticesY(v, angle) {
        const m4 = new THREE.Matrix4().makeRotationY(angle)
        this.applyMatrixToArray(m4, v)
    }
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


    /** CUSTOM 00 **************************/
    const R = .3
    const H = 1.2
    const N = 7

    const points = []
    for (let i = 0; i < N; ++i) {
        points.push([sin(i / N * PI2) * R, cos(i / N * PI2) * R])
    }


    const v1 = []
    const uv1 = []
    for (let i = 0; i < points.length; ++i) {
        const prev = points[i - 1] ? points[i - 1] : points[points.length - 1]
        const curr = points[i]

        const p = m.createPolygon(
            [prev[0], 0, prev[1]],
            [curr[0], 0, curr[1]],
            [curr[0], H, curr[1]],
            [prev[0], H, prev[1]],
        )

        v1.push(...p.v)
        uv1.push(...p.uv)
    }

    const copyV = [...v1]
    m.translateVertices(copyV, .7, 0, 0)
    const copyV2 = [...v1]
    m.translateVertices(copyV2, -.7, 0, 0)

    const v = [...v1, ...copyV, ...copyV2]
    const uv = [...uv1, ...uv1, ...uv1]

    const mesh = createMesh(v, uv, materials.brick)
    studio.addToScene(mesh)
}


window.addEventListener('load', () => {
    initApp().then()
})
