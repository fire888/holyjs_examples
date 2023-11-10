import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { updateEveryFrame } from "../helpers/frameUpdater"
import diff from '../assets/atlas.jpg'


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
    const studio = createStudio(25)
    studio.setCamPos(0, 4, 4)
    studio.setCamTargetPos(0, 1, 0)
    studio.setBackColor(0x333333)
    updateEveryFrame(studio.render)
    const materials = {
        'atlasBrick': new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: new THREE.TextureLoader().load(diff),
            bumpMap: new THREE.TextureLoader().load(diff),
            bumpScale: .02,
            //wireframe: true
        }),
    }

    /** CUSTOM 00 **************************/
    const R = .7
    const H = 1
    const N = 5

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
        uv1.push(...atlas[14])
    }

    const v2 = [...v1]
    m.translateVertices(v2, 0, H, 0)
    const uv2 = []
    points.forEach(() => {
        uv2.push(...atlas[3])
    })

    const v3 = [...v1]
    m.translateVertices(v3, 0, H * 2, 0)
    const uv3 = []
    points.forEach(() => {
        uv3.push(...atlas[4])
    })


    const v4 = []
    const uv4 = []
    for (let i = 0; i < points.length; ++i) {
        const prev = points[i - 1] ? points[i - 1] : points[points.length - 1]
        const curr = points[i]

        const p = [
            prev[0], 0, prev[1],
            curr[0], 0, curr[1],
            0, H, 0,
        ]

        v4.push(...p)
        uv4.push(...atlas[16])
    }
    m.translateVertices(v4, 0, H * 3, 0)


    const v = [...v1, ...v2, ...v3, ...v4]
    const uv = [...uv1, ...uv2, ...uv3, ...uv4]

    const mesh = createMesh(v, uv, materials.atlasBrick)
    studio.addToScene(mesh)

}


window.addEventListener('load', () => {
    initApp().then()
})
