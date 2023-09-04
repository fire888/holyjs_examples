import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'

const { sin, cos } = Math

async function initApp () {
    const studio = createStudio()
    const assets = await createLoadManager(ASSETS_TO_LOAD)
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

    /** CUSTOM 04_01 ***********************************/
    const v = [
        0, 0, 0,
        1, 0, 0,
        1, 2, 0,

        0, 0, 0,
        1, 2, 0,
        0, 2, 0,
    ]


    const m4r = new THREE.Matrix4().makeRotationY(1.3)
    const m4t = new THREE.Matrix4().makeTranslation(-3, 0, 0)
    const m4tz = new THREE.Matrix4().makeTranslation(0, 0, -3)

    const v3 = new THREE.Vector3()
    const updateArr = (m, arr) => {
        for (let i = 0; i < arr.length; i += 3) {
            v3.set(arr[i + 0], arr[i + 1], arr[i + 2])
            v3.applyMatrix4(m)
            arr[i + 0] = v3.x
            arr[i + 1] = v3.y
            arr[i + 2] = v3.z
        }
    }

    updateArr(m4r, v)
    updateArr(m4t, v)
    updateArr(m4tz, v)




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

    updateFunctions.push(n => {
        // const v = .01
        // geometry.attributes.uv.array[0] += v
        // geometry.attributes.uv.array[2] += v
        // geometry.attributes.uv.array[4] += v
        // geometry.attributes.uv.array[6] += v
        // geometry.attributes.uv.array[8] += v
        // geometry.attributes.uv.array[10] += v
        // geometry.attributes.uv.array[12] += v

        // const v = sin(n * 5) * .01
        // geometry.attributes.uv.array[0] += v
        // geometry.attributes.uv.array[2] += v
        // geometry.attributes.uv.array[4] += v
        // geometry.attributes.uv.array[6] += v
        // geometry.attributes.uv.array[8] += v
        // geometry.attributes.uv.array[10] += v
        // geometry.attributes.uv.array[12] += v

        geometry.attributes.uv.needsUpdate = true
    })

    /** *******************************************/
}


window.addEventListener('load', () => {
    initApp().then()
})
