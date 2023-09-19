import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import { createTopElem } from '../entities/archStructure/topElem'
import { column } from '../entities/archStructure/column'
const { sin, cos, PI} = Math
const PI2 = PI * 2
const hPI = PI / 2


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


const createMesh = (v, uv, c, material) => {
    const geometry = new THREE.BufferGeometry()
    const vF32 = new Float32Array(v)
    geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    geometry.computeVertexNormals()
    const uvF32 = new Float32Array(uv)
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
    const cF32 = new Float32Array(c)
    geometry.setAttribute('color', new THREE.BufferAttribute(cF32, 3))
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
        x < 0 && y > 0 && (rad = PI - Math.abs(rad))
        x < 0 && y <= 0 && (rad = PI + Math.abs(rad))
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
    getUvByLen: arr => {
        const uv = []
        let minX = 1000
        let minY = 1000
        let maxX = -1000
        let maxY = -1000
        for (let i = 0; i < arr.length; i += 3) {
            if (minX > arr[i]) {
                minX = arr[i]
            }
            if (maxX < arr[i]) {
                maxX = arr[i]
            }
            if (minY > arr[i + 1]) {
                minY = arr[i + 1]
            }
            if (maxY < arr[i + 1]) {
                maxY = arr[i + 1]
            }
        }

        const lx = maxX - minX
        const ly = maxY - minY

        for (let i = 0; i < arr.length; i += 3) {
            const x = (arr[i] - minX) / lx
            const y = (arr[i + 1] - minY) / ly
            uv.push(x, y)
        }
        return uv
    }
}

const createArch = {
    arc: function (w, h) {
        const v = []
        const uv = []

        const r = w / 2
        const n = 15
        const arcH = h - .5
        const z = .1

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
            const d1 = m.createPolygon(
                [p[i - 1][0], p[i - 1][1], 0],
                [p[i][0], p[i][1], 0],
                [...p[i]],
                [...p[i - 1]],
            )
            v.push(...d1.v)
        }
        const uvElem = m.getUvByLen(v)
        uv.push(...uvElem)
        const top = m.createPolygon(
            [-w / 2, h, z],
            [w / 2, h, z],
            [w / 2, h, 0],
            [-w / 2, h, 0],
        )
        v.push(...top.v)
        uv.push(...top.uv)
        const copy = [...v]
        m.rotateVerticesY(copy, PI)
        v.push(...copy)
        uv.push(...uv)
        return { v, uv }
    },
    column1: function (r, h) {
        const v = []
        const uv = []

        const c = m.createPolygon(
            [-r, 0, r],
            [r, 0, r],
            [r, h, r],
            [-r, h, r],
        )
        v.push(...c.v)
        uv.push(...c.uv)

        const copy1 = [...c.v]
        m.rotateVerticesY(copy1, hPI)
        v.push(...copy1)
        uv.push(...c.uv)

        const copy2 = [...c.v]
        m.rotateVerticesY(copy2, PI)
        v.push(...copy2)
        uv.push(...c.uv)

        const copy3 = [...c.v]
        m.rotateVerticesY(copy3, -hPI)
        v.push(...copy3)
        uv.push(...c.uv)

        return { v, uv }
    },
    elem: function (r, h) {
        const v = []
        const uv = []
        const uvE = [0, 0, 0, 0, 0, 0]

        const col = this.column1(r, h * .2)
        v.push(...col.v)
        uv.push(...col.uv)

        const tr = [
            -r, h * .2, r,
            r, h * .2, r,
            0, h, 0,
        ]
        v.push(...tr)
        uv.push(...uvE)

        const copy = [...tr]
        m.rotateVerticesY(copy, hPI)
        v.push(...copy)
        uv.push(...uvE)

        const copy1 = [...tr]
        m.rotateVerticesY(copy1, -hPI)
        v.push(...copy1)
        uv.push(...uvE)

        const copy2 = [...tr]
        m.rotateVerticesY(copy2, PI)
        v.push(...copy2)
        uv.push(...uvE)

        return { v, uv }
    },
}


async function initApp () {
    const studio = createStudio(1)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    const materials = {
        'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}),
        'brick': new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: assets.mapBrickDiff,
            bumpMap: assets.mapBrickDiff,
            bumpScale: .02,
           // side: THREE.DoubleSide
        }),
        'brickColor': new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: assets.mapBrickDiff,
            bumpMap: assets.mapBrickDiff,
            bumpScale: .02,
            vertexColors: true,
            // side: THREE.DoubleSide
        }),
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

    const elemT = createTopElem({ r: .1, h: 1, color1: [1, 0, 0], color2: [0, 1, 0] })

    const mesh = createMesh(elemT.v, elemT.uv, elemT.c,  materials.brickColor)
    mesh.position.set(1, 0, 0)
    studio.addToScene(mesh)

    //const columnVery = column({color1: [1, 0, 0], color2: [0, 1, 0], h: 1, r: .05 })
    const columnVery = column({color1: [1, 0, 0], color2: [0, 1, 0], h: 1, r: .05 })
    const mesh1 = createMesh(columnVery.v, columnVery.uv, columnVery.c,  materials.brickColor)
    mesh1.position.set(.5, 0, 0)
    studio.addToScene(mesh1)


    // const v = []
    // const uv = []
    //
    // let x = 0
    // for (let i = 0; i < 15; ++i) {
    //     const w = Math.random() * 3 + 1
    //     x += w
    //
    //     const arc = createArch.arc(w,2)
    //     m.translateVertices(arc.v, x - w / 2, 0, 0)
    //     v.push(...arc.v)
    //     uv.push(...arc.uv)
    //
    //     const column = createArch.column1(.2, 2)
    //     m.translateVertices(column.v, x, 0, 0)
    //     v.push(...column.v)
    //     uv.push(...column.uv)
    //
    //     const elem = createArch.elem(.2, 1.5)
    //     m.translateVertices(elem.v, x, 2, 0)
    //     v.push(...elem.v)
    //     uv.push(...elem.uv)
    // }


    //const mesh = createMesh(v, uv, materials.brick)
    //studio.addToScene(mesh)
}


window.addEventListener('load', () => {
    initApp().then()
})
