import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { createLoadManager } from '../helpers/loadManager'
import { updateEveryFrame } from "../helpers/frameUpdater";
import { ASSETS_TO_LOAD } from './ASSETS'

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
    studio.setBackColor(0x333333)
    studio.setCamTargetPos(.5, 1, 0)
    updateEveryFrame(studio.render)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    const materials = {
        'phongWhite': new THREE.MeshPhongMaterial({
            color: 0x999999,
            flatShading: false,
        }),
    }

    /** CUSTOM 00 **************************/
    const prBottom = assets.profiles.children.filter(item => item.name === 'profilebottom')[0].geometry.attributes.position.array
    const prTop = assets.profiles.children.filter(item => item.name === 'profiletop')[0].geometry.attributes.position.array

    const W = 2
    const H = 1
    m.translateVertices(prTop, 0, H, 0)

    const pr = [...prBottom, ...prTop]

    const v = []
    const uv = []

    const prX = [...pr]
    m.translateVertices(prX, W, 0, 0)

    for (let i = 3; i < pr.length; i += 3) {
        const prevI = i - 3
        const nextI = i

        const p = m.createPolygon(
            [pr[prevI], pr[prevI + 1], pr[prevI + 2]],
            [prX[prevI], prX[prevI + 1], prX[prevI + 2]],
            [prX[nextI], prX[nextI + 1], prX[nextI + 2]],
            [pr[nextI], pr[nextI + 1], pr[nextI + 2]],
        )
        v.push(...p.v)
        uv.push(...p.uv)
    }
    const mesh = createMesh(v, uv, materials.phongWhite)
    studio.addToScene(mesh)
}


window.addEventListener('load', () => {
    initApp().then()
})
