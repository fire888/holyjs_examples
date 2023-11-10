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

    /** ************************************************/
    const createTower = (h, r, rN, hRoof) => {
        const points = []
        for (let i = 0; i < rN; ++i) {
            points.push([sin(i / rN * PI2) * r, cos(i / rN * PI2) * r])
        }

        const nFloors = Math.floor(h / 0.7) + 1
        const hFloor = h / nFloors

        const v = []
        const uv = []
        for (let nFloor = 0; nFloor < nFloors; ++nFloor) {
            for (let i = 0; i < points.length; ++i) {
                const prev = points[i - 1] ? points[i - 1] : points[points.length - 1]
                const curr = points[i]

                const p = m.createPolygon(
                    [prev[0], nFloor * hFloor, prev[1]],
                    [curr[0], nFloor * hFloor, curr[1]],
                    [curr[0], (nFloor + 1) * hFloor, curr[1]],
                    [prev[0], (nFloor + 1) * hFloor, prev[1]],
                )

                v.push(...p.v)
                if (nFloor === 0) {
                    uv.push(...atlas[14])
                }
                else if (nFloor === nFloors - 1) {
                    uv.push(...atlas[4])
                }
                else {
                    const r = Math.random()
                    uv.push(...atlas[r > .3 ? 0 : Math.floor(Math.random() * 14)])
                }
            }
        }
        for (let i = 0; i < points.length; ++i) {
            const prev = points[i - 1] ? points[i - 1] : points[points.length - 1]
            const curr = points[i]

            const p = [
                prev[0], h, prev[1],
                curr[0], h, curr[1],
                0, h + hRoof, 0,
            ]

            v.push(...p)
            uv.push(...atlas[16])
        }

        return { v, uv }
    }

    const v = []
    const uv = []

    for (let i = 0; i < 130; ++i) {
        const H = Math.random() * 15
        const house1 = createTower(H, Math.random() * 1.5 + .3, Math.random() * 7 + 3, Math.random() * 4 + .5)
        m.translateVertices(house1.v, Math.random() * 20 - 10, 0, Math.random() * 20 - 10)
        v.push(...house1.v)
        uv.push(...house1.uv)
    }

    const mesh = createMesh(v, uv, materials.atlasBrick)
    studio.addToScene(mesh)
}


window.addEventListener('load', () => {
    initApp().then()
})
