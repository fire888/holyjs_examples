import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'

const { sin, cos } = Math


const atlas = (() => {
    const h = 1 / 4
    const arr = []
    for (let i = 1; i < 5; ++i) {
        for (let j = 1; j < 5; ++j) {
            arr.push([
                (i - 1) * h, (j - 1) * h,
                i * h, (j - 1) * h,
                i * h, j * h,
                (i - 1) * h, (j - 1) * h,
                i * h, j * h,
                (i - 1) * h, j * h
            ])
        }
    }
    return arr
})()


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
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    assets.atlasBrickDiff.wrapS = assets.atlasBrickDiff.wrapT = THREE.RepeatWrapping
    const materials = {
        'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}),
        'brick': new THREE.MeshBasicMaterial({color: 0xFFFFFF, map: assets.mapBrickDiff, side: THREE.DoubleSide}),
        'atlasBrick': new THREE.MeshBasicMaterial({color: 0xFFFFFF, map: assets.atlasBrickDiff, side: THREE.DoubleSide}),
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

    // const p1 = createPolygon([0, 0, 0], [1, 0, 0], [1, 2, 0], [0, 2, 0])
    //
    // const v = []
    // const uv = []
    //
    // const N = 10
    // for (let i = 0; i < 10; ++i) {
    //     const copyV = [...p1.v]
    //     translateVertices(copyV, 0, 0, 1)
    //     rotateVerticesY(copyV, i / N * Math.PI * 2)
    //     v.push(...copyV)
    //     uv.push(...p1.uv)
    // }
    //
    // const mesh = new createMesh(v, uv, materials.brick)
    // studio.addToScene(mesh)


    /** CUSTOM 01 **************************/

    console.log(atlas)

    const createArrays = (phase) => {
        const v = []
        const uv = []

        const ph = phase % (Math.PI * 2)
        const p1 = createPolygon([0, 0, 0], [1, 0, 0], [1, 2, sin(ph)], [0, 2, sin(ph)])

        const N = 10
        for (let i = 0; i < N; ++i) {
            const copyV = [...p1.v]
            translateVertices(copyV, -.5, 0, 0)
            rotateVerticesY(copyV, ph)
            translateVertices(copyV, 0, 0, 2)
            rotateVerticesY(copyV, i / N * (Math.PI * 2))
            v.push(...copyV)
            uv.push(...atlas[Math.floor(Math.random() * atlas.length)])
        }

        return { v, uv }
    }

    const { v, uv } = createArrays(0)
    const mesh = createMesh(v, uv, materials.atlasBrick)
    studio.addToScene(mesh)

    updateFunctions.push(n => {
            const { v } = createArrays(n)
            v.forEach((elem, i) => {
                if (i % 2 > 0) {
                    mesh.geometry.attributes.uv.array[i] -= .001
                }
            })
            mesh.geometry.attributes.uv.needsUpdate = true
    })

    /** *******************************************/

}


window.addEventListener('load', () => {
    initApp().then()
})
