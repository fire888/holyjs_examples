import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import {translateArr} from "../helpers/geomHelpers";


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
    geometry.computeVertexNormals()
    const uvF32 = new Float32Array(uv)
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
    return new THREE.Mesh(geometry, material)
}



async function initApp () {
    const studio = createStudio(2)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    console.log(assets)
    const materials = {
        'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}),
        'brick': new THREE.MeshBasicMaterial({color: 0xFFFFFF, map: assets.mapBrickDiff, side: THREE.DoubleSide}),
        'atlasBrick': new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: assets.atlasBrickDiff,
            bumpMap: assets.atlasBrickDiff,
            bumpScale: .02,
            //wireframe: true
        }),
        'phongWhite': new THREE.MeshPhongMaterial({
            color: 0x999999,
            flatShading: false,
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
    const l00 = assets.profiles.children.filter(item => item.name === 'profiletop')[0].geometry.attributes.position.array
    const l01 = assets.profiles.children.filter(item => item.name === 'profilebottom')[0].geometry.attributes.position.array

    const W = 3
    const H = 2
    let bottomWallLeft, bottomWallRight, topWallRight, topWallLeft

    const v = []
    const uv = []

    {
        const l00x = [...l00]
        translateArr(l00x, W, 0, 0)

        for (let i = 3; i < l00.length; i += 3) {
            const prevI = i - 3
            const nextI = i

            const p = m.createPolygon(
                [l00[prevI], l00[prevI + 1], l00[prevI + 2]],
                [l00x[prevI], l00x[prevI + 1], l00x[prevI + 2]],
                [l00x[nextI], l00x[nextI + 1], l00x[nextI + 2]],
                [l00[nextI], l00[nextI + 1], l00[nextI + 2]],
            )
            v.push(...p.v)
            uv.push(...p.uv)

            if (!l00[i - 4]) {
                topWallLeft = [l00[nextI], l00[nextI + 1], l00[nextI + 2]]
                topWallRight = [l00x[nextI], l00x[nextI + 1], l00x[nextI + 2]]
            }
        }
        translateArr(v, 0, H, 0)
        topWallLeft = [v[0], v[1], v[2]]
        topWallRight = [v[3], v[4], v[5]]
    }

    {
        const l01x = [...l01]
        translateArr(l01x, W, 0, 0)

        for (let i = 3; i < l01.length; i += 3) {
            const prevI = i - 3
            const nextI = i

            const p = m.createPolygon(
                [l01[prevI], l01[prevI + 1], l01[prevI + 2]],
                [l01x[prevI], l01x[prevI + 1], l01x[prevI + 2]],
                [l01x[nextI], l01x[nextI + 1], l01x[nextI + 2]],
                [l01[nextI], l01[nextI + 1], l01[nextI + 2]],
            )
            v.push(...p.v)
            uv.push(...p.uv)
        }
        const l = v.length
        bottomWallLeft = [v[l - 3], v[l - 2], v[l - 1]]
        bottomWallRight = [v[l - 6], v[l - 5], v[l - 4]]
    }

    const back = m.createPolygon(
        bottomWallLeft,
        bottomWallRight,
        topWallRight,
        topWallLeft,
    )
    v.push(...back.v)
    uv.push(...back.uv)

    const mesh = createMesh(v, uv, materials.phongWhite)
    studio.addToScene(mesh)
}


window.addEventListener('load', () => {
    initApp().then()
})
