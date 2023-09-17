import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import {translateArr} from "../helpers/geomHelpers";
const { sin, cos, PI} = Math
const PI2 = PI * 2


const atlas = (() => {
    const h = 1 / 4
    const arr = []
    for (let i = 1; i < 5; ++i) {
        for (let j = 1; j < 5; ++j) {
            arr.push([
                (j - 1) * h, (i - 1) * h,
                j * h, (i - 1) * h,
                j * h, i * h,
                (j - 1) * h, (i - 1) * h,
                j * h, i * h,
                (j - 1) * h, i * h
            ])
        }
    }
    arr.push([
        .75, .75,
        1, .75,
        .88, 1
    ])
    return arr
})()


const createMesh = (v, uv, material) => {
    const geometry = new THREE.BufferGeometry()
    const vF32 = new Float32Array(v)
    geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    geometry.computeVertexNormals()
    const uvF32 = new Float32Array(uv)
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
    return new THREE.Mesh(geometry, material)
}

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
    },
    angleFromCoords (x, y) {
        let rad = Math.atan(y / x)
        x < 0 && y > 0 && (rad = Math.PI - Math.abs(rad))
        x < 0 && y <= 0 && (rad = Math.PI + Math.abs(rad))
        rad += Math.PI * 6
        rad = rad % (Math.PI * 2)
        return -rad
    },
    mirrorZ: (arr) => {
        const arr2 = []
        for (let i = 0; i < arr.length; i += 18) {
            if (!arr[i + 1]) {
                continue;
            }
            arr2.push(
                arr[i + 3], arr[i + 4], -arr[i + 5],
                arr[i], arr[i + 1], -arr[i + 2],
                arr[i + 15], arr[i + 16], -arr[i + 17],
                arr[i + 3], arr[i + 4], -arr[i + 5],
                arr[i + 15], arr[i + 16], -arr[i + 17],
                arr[i + 12], arr[i + 13], -arr[i + 14],
            )
        }
        arr.push(...arr2)
    },
}

const createData = {
    arc: (w, h) => {
        const v = []
        const uv = []

        const r = w / 2
        const n = 15
        const arcH = h - .5
        const z = .3

        const p = []
        for (let i = 0; i < n; ++i) {
            p.push([
                cos((n - i) / n * PI) * r,
                sin((n - i) / n * PI) * arcH,
                z,
            ])
        }
        p.push([w / 2, 0, z])

        for (let i = 1; i < p.length; ++i) {
            const d = m.createPolygon(
                [...p[i - 1]],
                [...p[i]],
                [p[i][0], h, z],
                [p[i - 1][0], h, z],
            )
            v.push(...d.v)
            uv.push(...d.uv)

            const d1 = m.createPolygon(
                [p[i - 1][0], p[i - 1][1], 0],
                [p[i][0], p[i][1], 0],
                [...p[i]],
                [...p[i - 1]],
            )
            v.push(...d1.v)
            uv.push(...d1.uv)
        }
        const top = m.createPolygon(
            [-w / 2, h, z],
            [w / 2, h, z],
            [w / 2, h, 0],
            [-w / 2, h, 0],
        )
        v.push(...top.v)
        uv.push(...top.uv)
        m.mirrorZ(v)
        uv.push(...uv)
        return { v, uv }
    },
    column1: (r, h) => {
        const v = []
        const uv = []
    },
    elem: (r, h) => {
        const v = []
        const uv = []
    },
}


async function initApp () {
    const studio = createStudio(10)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    const materials = {
        'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}),
        'brick': new THREE.MeshBasicMaterial({color: 0xFFFFFF, map: assets.mapBrickDiff, side: THREE.DoubleSide}),
        'atlasBrick': new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: assets.atlasBrickDiff,
            bumpMap: assets.atlasBrickDiff,
            bumpScale: .02,
        }),
        'phongWhite': new THREE.MeshPhongMaterial({color: 0x999999, flatShading: false,}),
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
    const v = []
    const uv = []

    let x = 0
    for (let i = 0; i < 15; ++i) {
        const w = Math.random() * 3 + 1
        x += w
        const arc = createData.arc(w,2)
        m.translateVertices(arc.v, x - w / 2, 0, 0)
        v.push(...arc.v)
        uv.push(...arc.uv)
    }


    const mesh = createMesh(v, uv, materials.phongWhite)
    studio.addToScene(mesh)
}


window.addEventListener('load', () => {
    initApp().then()
})
