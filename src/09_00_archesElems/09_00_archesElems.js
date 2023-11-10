import * as THREE from 'three'
import { createStudio } from '../helpers/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from './ASSETS'


const { sin, cos, PI, random, floor } = Math
const PI2 = PI * 2
const hPI = PI / 2


const M = {
    createPolygon:(v0, v1, v2, v3) => [...v0, ...v1, ...v2, ...v0, ...v2, ...v3],
    fillColorFace: c => [...c, ...c, ...c, ...c, ...c, ...c],
    createUv: (v1, v2, v3, v4) => [...v1, ...v2, ...v3, ...v1, ...v3, ...v4],
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
    },
    ran: function (start, end) { return start + Math.random() * (end - start) },
    createFaceWithSquare: function (v1, v2, v3, v4, color1, color2) {
        const maxW = v2[0] - v1[0]
        const maxH = v3[1] - v1[1]

        const innerW = this.ran(maxW * 0.3, maxW * 0.7)
        const innerH = this.ran(maxH * 0.3, maxH * 0.7)

        const x1 = v1[0] + (maxW - innerW) / 2
        const x2 = v2[0] - (maxW - innerW) / 2
        const y1 = v1[1] + (maxH - innerH) / 2
        const y2 = v3[1] - (maxH - innerH) / 2

        const v1_i = [x1, y1, v1[2]]
        const v2_i = [x2, y1, v1[2]]
        const v3_i = [x2, y2, v1[2]]
        const v4_i = [x1, y2, v1[2]]

        // outer 
        const vArr = [
            ...this.createPolygon(v1, v2, v2_i, v1_i),
            ...this.createPolygon(v2_i, v2, v3, v3_i),
            ...this.createPolygon(v4_i, v3_i, v3, v4),
            ...this.createPolygon(v1, v1_i, v4_i, v4),
        ]

        const uArr = this.getUvByLen(vArr)
        
        // inner square
        vArr.push(
            ...this.createPolygon(v1_i, v2_i, v3_i, v4_i),
        )
        uArr.push(...this.createUv(
            [.5, .5],
            [1, .5],
            [1, 1],
            [.5, 1],
        ))  
        
        const cArr = [
            ...this.fillColorFace(color2),
            ...this.fillColorFace(color2),
            ...this.fillColorFace(color2),
            ...this.fillColorFace(color2),
            ...this.fillColorFace(color1),
        ]

        return { vArr, cArr, uArr }
    },
}

const topElem = ({ color1 = [1, 0, 0], color2 = [0, 0, 1], h = 1, r = .1 }) => {
    const v = []
    const c = []
    const uv = []

    const hl0 = 0
    const hl1 = hl0 + random() * 0.3 * h // base
    const hl2 = hl1 + random() * 0.3 * h
    const hl3 = hl2 + random() * 0.3 * h // trunk
    const hl4 = hl3 + random() * .1 * h
    const hl5 = hl4 + random() * .2 * h // belt
    const diff = h - hl5
    const hl6 = hl5
    const hl7 = hl6 + diff * random()
    const hl8 = h
    const count = 6
    for (let i = 0; i < count; ++i) {
        let nextI = i + 1
        nextI > count && (nextI = 0)
        const a1 = i / count * PI2
        const a2 = nextI / count * PI2
        const sA1 = sin(a1)
        const cA1 = cos(a1)
        const sA2 = sin(a2)
        const cA2 = cos(a2)
        /** bottom cylinder */
        let r1 = r
        let r2 = r
        v.push(...M.createPolygon(
            [sA1 * r1, hl0, cA1 * r1],
            [sA2 * r1, hl0, cA2 * r1],
            [sA2 * r2, hl1, cA2 * r2],
            [sA1 * r2, hl1, cA1 * r2],
        ))
        /** connect */
        r1 = r2
        r2 = r * .3
        v.push(...M.createPolygon(
            [sA1 * r1, hl1, cA1 * r1],
            [sA2 * r1, hl1, cA2 * r1],
            [sA2 * r2, hl2, cA2 * r2],
            [sA1 * r2, hl2, cA1 * r2],
        ))
        /** center cylinder */
        r1 = r2
        r2 = r1
        v.push(...M.createPolygon(
            [sA1 * r1, hl2, cA1 * r1],
            [sA2 * r1, hl2, cA2 * r1],
            [sA2 * r2, hl3, cA2 * r2],
            [sA1 * r2, hl3, cA1 * r2],
        ))
        /** connect */
        r1 = r2
        r2 = r
        v.push(...M.createPolygon(
            [sA1 * r1, hl3, cA1 * r1],
            [sA2 * r1, hl3, cA2 * r1],
            [sA2 * r2, hl4, cA2 * r2],
            [sA1 * r2, hl4, cA1 * r2],
        ))
        r1 = r2
        r2 = r1
        /** baraban */
        v.push(...M.createPolygon(
            [sA1 * r1, hl4, cA1 * r1],
            [sA2 * r1, hl4, cA2 * r1],
            [sA2 * r2, hl5, cA2 * r2],
            [sA1 * r2, hl5, cA1 * r2],
        ))
        r1 = r2
        r2 = r * 0.3
        v.push(...M.createPolygon(
            [sA1 * r1, hl5, cA1 * r1],
            [sA2 * r1, hl5, cA2 * r1],
            [sA2 * r2, hl6, cA2 * r2],
            [sA1 * r2, hl6, cA1 * r2],
        ))
        r1 = r2
        r2 = r
        v.push(...M.createPolygon(
            [sA1 * r1, hl6, cA1 * r1],
            [sA2 * r1, hl6, cA2 * r1],
            [sA2 * r2, hl7, cA2 * r2],
            [sA1 * r2, hl7, cA1 * r2],
        ))
        v.push(
            sA1 * r2, hl7, cA1 * r2,
            sA2 * r2, hl7, cA2 * r2,
            0, hl8, 0,
        )
        c.push(
            ...M.fillColorFace(color1),
            ...M.fillColorFace(color2),
            ...M.fillColorFace(color2),
            ...M.fillColorFace(color2),
            ...M.fillColorFace(color1),
            ...M.fillColorFace(color1),
            ...M.fillColorFace(color1),
            ...color1,
            ...color1,
            ...color1,
        )
        uv.push(
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...M.createUv([0, .5], [.5, .5], [.5, 1], [0, 1],),
            ...[0, .5],
            ...[.5, .5],
            ...[.25, 1],
        )
    }
    return { v, c, uv }
}

const createDataSideColumn = ({ h = 2, r = .1, color1 = [1, 0, 0], color2 = [0, 1, 0] }) => {
    const v = []
    const c = []
    const uv = []

    let i = -1
    let rLast = null
    let currH = 0

    while (currH < h) {
        ++i
        const currentStep = r * M.ran(2, 8)

        let newH = currH + currentStep
        if (h - newH < r * 2) newH = h // clamp last step not small
        if (i === 0) newH = newH * .3 // bottom base

        /** bottom base */
        if (i === 0) {
            v.push(...M.createPolygon([-r, currH, r], [r, currH, r], [r, newH, r], [-r, newH, r]))
            c.push(...M.fillColorFace(color1))
            uv.push(...M.createUv([.5, 0], [1, 0], [1, .5], [.5, .5],))
            rLast = r
            currH = newH
            continue;
        }
        let h0 = currH
        let h1 = h0 + currentStep * 0.1
        let r1 = rLast
        let r2 = M.ran(r * .4, r * 1.8)
        v.push(...M.createPolygon([-r1, h0, r1], [r1, h0, r1], [r2, h1, r2], [-r2, h1, r2],))
        c.push(...M.fillColorFace(color2))
        uv.push(...M.createUv([.5, 0], [1, 0], [1, .5], [.5, .5],))
        /** square */
        const diff2 = M.ran(.5, 1.2) * r
        h0 = h1
        h1 = newH - diff2
        r1 = r2
        r2 = r1
        const poly = M.createFaceWithSquare([-r1, h0, r1], [r1, h0, r1], [r2, h1, r2], [-r2, h1, r2],
            newH === h ? color2 : color1,
            newH === h ? color1 : color2,
            //color2,
        )
        v.push(...poly.vArr)
        c.push(...poly.cArr)
        uv.push(...poly.uArr)

        h0 = h1
        h1 = newH - diff2 * .7
        r1 = r2
        r2 = newH === h
            ? r
            : M.ran(r * .4, r * 2)
        v.push(...M.createPolygon([-r1, h0, r1], [r1, h0, r1], [r2, h1, r2], [-r2, h1, r2],))
        c.push(...M.fillColorFace(color2))
        uv.push(...M.createUv([.5, 0], [1, 0], [1, .5], [.5, .5],))
        /** belt */
        h0 = h1
        h1 = newH
        r1 = r2
        r2 = r1
        v.push(...M.createPolygon([-r1, h0, r1], [r1, h0, r1], [r2, h1, r2], [-r2, h1, r2],))
        c.push(...M.fillColorFace(color1))
        uv.push(...M.createUv([.5, 0], [1, 0], [1, .5], [.5, .5],))

        rLast = r2
        currH = newH
    }
    return { v, c, uv }
}
const column = ({ h = 2, r = .1, color1 = [1, 0, 0], color2 = [0, 1, 0] }) => {
    const v = []
    const c = []
    const uv = []

    const side = createDataSideColumn({ h, r, color1, color2 })

    const copyV1 = [...side.v]
    M.rotateVerticesY(copyV1, Math.PI / 2)
    v.push(...copyV1)
    c.push(...side.c)
    uv.push(...side.uv)

    const copyV2 = [...side.v]
    M.rotateVerticesY(copyV2, -Math.PI / 2)
    v.push(...copyV2)
    c.push(...side.c)
    uv.push(...side.uv)

    const copyV3 = [...side.v]
    M.rotateVerticesY(copyV3, Math.PI)
    v.push(...copyV3)
    c.push(...side.c)
    uv.push(...side.uv)

    v.push(...side.v)
    c.push(...side.c)
    uv.push(...side.uv)

    const l = side.v.length
    v.push(...M.createPolygon(
        [side.v[l - 3], side.v[l - 2], side.v[l - 1]],
        [side.v[l - 6], side.v[l - 5], side.v[l - 4]],
        [copyV3[l - 3], copyV3[l - 2], copyV3[l - 1]],
        [copyV3[l - 6], copyV3[l - 5], copyV3[l - 4]],
    ))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    return { v, c, uv }
}

const arc = ({ h = 1, beltH = .05, w = 2, d = 0.03, n = 15, color1 = [1, 0, 0], color2 = [0, 1, 1] }) => {
    const v = []
    const uv = []
    const c = []

    const r = w / 2
    const hBelt = h - beltH
    const arcH = hBelt - (h * .05)
    const z = d - (d * .2)

    const points = []
    for (let i = 0; i < n; ++i) {
        points.push([
            cos((n - i) / n * PI) * r,
            sin((n - i) / n * PI) * arcH,
            z,
        ])
    }
    points.push([w / 2, 0, z])

    for (let i = 1; i < points.length; ++i) {
        const d = M.createPolygon(
            [...points[i - 1]],
            [...points[i]],
            [points[i][0], h, z],
            [points[i - 1][0], h, z],
        )
        v.push(...d)
        c.push(...M.fillColorFace(color2))
        const d1 = M.createPolygon(
            [points[i - 1][0], points[i - 1][1], 0],
            [points[i][0], points[i][1], 0],
            [...points[i]],
            [...points[i - 1]],
        )
        v.push(...d1)
        c.push(...M.fillColorFace(color1))
    }
    const uvElem = M.getUvByLen(v)
    uv.push(...uvElem)

    v.push(...M.createPolygon([-w / 2, hBelt, 0], [w / 2, hBelt, 0], [w / 2, hBelt, d], [-w / 2, hBelt, d],))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    v.push(...M.createPolygon([-w / 2, hBelt, d], [w / 2, hBelt, d], [w / 2, h, d], [-w / 2, h, d],))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    v.push(...M.createPolygon([-w / 2, h, d], [w / 2, h, d], [w / 2, h, 0], [-w / 2, h, 0],))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    const copy = [...v]
    M.rotateVerticesY(copy, PI)
    v.push(...copy)
    c.push(...c)
    uv.push(...uv)

    M.translateVertices(v, w / 2, 0, 0)
    return {v, c, uv}
}

const columnSimple = ({ h = 2, r = .1, beltH = .05, color1 = [1, 0, 0], color2 = [0, 1, 0] }) => {
    const v = []
    const c = []
    const uv = []

    const r1 = r * .8
    const hb = h - beltH

    const vS = [
        ...M.createPolygon(
            [-r1, 0, r1],
            [r1 , 0, r1],
            [r1, h, r1],
            [-r1, h, r1],
        ),
        ...M.createPolygon(
            [-r, hb, r],
            [r, hb, r],
            [r, h, r],
            [-r, h, r],
        )
    ]
    const cS = [
        ...M.fillColorFace(color2),
        ...M.fillColorFace(color1)
    ]
    const uvS = [
        ...M.createUv([0, 0], [.2, 0], [.2, 1], [0, 1]),
        ...M.createUv([0, 0], [.2, 0], [.2, 1], [0, 1]),
    ]

    v.push(...vS)
    c.push(...cS)
    uv.push(...uvS)

    const copyV1 = [...vS]
    M.rotateVerticesY(copyV1, Math.PI / 2)
    v.push(...copyV1)
    c.push(...cS)
    uv.push(...uvS)

    const copyV2 = [...vS]
    M.rotateVerticesY(copyV2, -Math.PI / 2)
    v.push(...copyV2)
    c.push(...cS)
    uv.push(...uvS)

    const copyV3 = [...vS]
    M.rotateVerticesY(copyV3, Math.PI)
    v.push(...copyV3)
    c.push(...cS)
    uv.push(...uvS)

    v.push(...vS)
    c.push(...cS)
    uv.push(...uvS)

    const l = vS.length
    v.push(...M.createPolygon(
        [vS[l - 3], vS[l - 2], vS[l - 1]],
        [vS[l - 6], vS[l - 5], vS[l - 4]],
        [copyV3[l - 3], copyV3[l - 2], copyV3[l - 1]],
        [copyV3[l - 6], copyV3[l - 5], copyV3[l - 4]],
    ))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    v.push(...M.createPolygon(
        [copyV3[l - 6], hb, copyV3[l - 4]],
        [copyV3[l - 3], hb, copyV3[l - 1]],
        [vS[l - 6], hb, vS[l - 4]],
        [vS[l - 3], hb, vS[l - 1]],

    ))
    c.push(...M.fillColorFace(color1))
    uv.push(...M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))

    return { v, c, uv }
}

const ARCH = { arc, topElem, columnSimple, column, createDataSideColumn }

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

async function initApp () {
    const studio = createStudio(20)
    studio.setBackColor(0x333333)
    studio.setCamTargetPos(.7, .5, 0)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    const materials = {
        'brickColor': new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: assets.mapBrickDiff,
            bumpMap: assets.mapBrickDiff,
            bumpScale: .02,
            vertexColors: true,
            //wireframe: true,
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
    const color1 =  [.3, .3, .5]
    const color2 =  [1, 1, .5]

    const elemT = ARCH.topElem({ h: .5, r: .05, color1, color2 })
    const mesh = createMesh(elemT.v, elemT.uv, elemT.c,  materials.brickColor)
    mesh.position.set(0, 0, 0)
    studio.addToScene(mesh)

    const columnVery = ARCH.column({ h: 1, r: .05,  color1, color2  })
    const mesh1 = createMesh(columnVery.v, columnVery.uv, columnVery.c,  materials.brickColor)
    mesh1.position.set(.5, 0, 0)
    studio.addToScene(mesh1)

    const arcD = ARCH.arc({ h: .5, w: .3, color1, color2 })
    const mesh2 = createMesh(arcD.v, arcD.uv, arcD.c, materials.brickColor)
    mesh2.position.set(1, 0, 0)
    studio.addToScene(mesh2)

    const c2 = ARCH.columnSimple({ h: .5, r: .05, color1, color2 })
    const mesh3 = createMesh(c2.v, c2.uv, c2.c, materials.brickColor)
    mesh3.position.set(1.5, 0, 0)
    studio.setCamPos(.5, 1, 2)
    studio.addToScene(mesh3)
}

window.addEventListener('load', () => {
    initApp().then()
})
