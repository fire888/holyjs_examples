import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../entities/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'

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

    // /** CUSTOM 00 **************************/
    // const prBottom = assets.profiles.children.filter(item => item.name === 'profilebottom')[0].geometry.attributes.position.array
    // const prTop = assets.profiles.children.filter(item => item.name === 'profiletop')[0].geometry.attributes.position.array
    //
    // const W = 1
    // const H = 2
    // m.translateVertices(prTop, 0, H, 0)
    //
    // const pr = [...prBottom, ...prTop]
    //
    // const v = []
    // const uv = []
    //
    // const prX = [...pr]
    // m.translateVertices(prX, W, 0, 0)
    //
    // for (let i = 3; i < pr.length; i += 3) {
    //     const prevI = i - 3
    //     const nextI = i
    //
    //     const p = m.createPolygon(
    //         [pr[prevI], pr[prevI + 1], pr[prevI + 2]],
    //         [prX[prevI], prX[prevI + 1], prX[prevI + 2]],
    //         [prX[nextI], prX[nextI + 1], prX[nextI + 2]],
    //         [pr[nextI], pr[nextI + 1], pr[nextI + 2]],
    //     )
    //     v.push(...p.v)
    //     uv.push(...p.uv)
    // }
    // const mesh = createMesh(v, uv, materials.phongWhite)
    // studio.addToScene(mesh)

    /** CUSTOM 00 **************************/
    const l00 = assets.profiles.children.filter(item => item.name === 'profiletop')[0].geometry.attributes.position.array
    const l01 = assets.profiles.children.filter(item => item.name === 'profilebottom')[0].geometry.attributes.position.array

    const createWall = (W, H, profileB) => {
        const v = []
        const uv = []

        const l = [...profileB]
        const lx = [...l]

        m.rotateVerticesY(l, Math.PI / 4)
        m.rotateVerticesY(lx, -Math.PI / 4)
        m.translateVertices(lx, W, 0, 0)


        for (let i = 3; i < l.length; i += 3) {
            const prevI = i - 3
            const nextI = i

            const p = m.createPolygon(
                [l[prevI], l[prevI + 1], l[prevI + 2]],
                [lx[prevI], lx[prevI + 1], lx[prevI + 2]],
                [lx[nextI], lx[nextI + 1], lx[nextI + 2]],
                [l[nextI], l[nextI + 1], l[nextI + 2]],
            )
            v.push(...p.v)
            uv.push(...p.uv)
        }
        return { v, uv }
    }

    const v = []
    const uv = []
    const corners = {
        c1b: null,
        c1t: null,
        c2b: null,
        c2t: null,
        c3b: null,
        c3t: null,
        c4b: null,
        c4T: null,
    }

    // const copyT = [...l00]
    // m.translateVertices(copyT, 0, 2, 0, 0)
    // const fullP = [...l01, ...copyT]
    const fullP = assets.profiles.children.filter(item => item.name === 'profile3')[0].geometry.attributes.position.array

    const w1 = createWall(3, 2, fullP)
    v.push(...w1.v)
    uv.push(...w1.uv)
    corners.c1b = [w1.v[0], w1.v[1], w1.v[2]]
    corners.c2b = [w1.v[3], w1.v[4], w1.v[5]]
    const l = w1.v.length
    corners.c1t = [w1.v[l - 3], w1.v[l - 2], w1.v[l - 1]]
    corners.c2t = [w1.v[l - 6], w1.v[l - 5], w1.v[l - 4]]

    const w2 = createWall(5, 2, fullP)
    m.rotateVerticesY(w2.v, -Math.PI / 2)
    m.translateVertices(w2.v, 3, 0, 0)
    v.push(...w2.v)
    uv.push(...w2.uv)

    const w3 = createWall(3, 2, fullP)
    m.rotateVerticesY(w3.v, -Math.PI)
    m.translateVertices(w3.v, 3, 0, 5)
    v.push(...w3.v)
    uv.push(...w3.uv)
    corners.c3b = [w3.v[0], w3.v[1], w3.v[2]]
    corners.c4b = [w3.v[3], w3.v[4], w3.v[5]]
    const l2 = w3.v.length
    corners.c3t = [w3.v[l2 - 3], w3.v[l2 - 2], w3.v[l2 - 1]]
    corners.c4t = [w3.v[l2 - 6], w3.v[l2 - 5], w3.v[l2 - 4]]

    const w4 = createWall(5, 2, fullP)
    m.rotateVerticesY(w4.v, Math.PI / 2)
    m.translateVertices(w4.v, 0, 0, 5)
    v.push(...w4.v)
    uv.push(...w4.uv)

    const floor = m.createPolygon(
        corners.c4b,
        corners.c3b,
        corners.c2b,
        corners.c1b,
    )
    v.push(...floor.v)
    uv.push(...floor.uv)

    const ceil = m.createPolygon(
        corners.c1t,
        corners.c2t,
        corners.c3t,
        corners.c4t,
    )
    v.push(...ceil.v)
    uv.push(...ceil.uv)

    const mesh = createMesh(v, uv, materials.phongWhite)
    studio.addToScene(mesh)
}


window.addEventListener('load', () => {
    initApp().then()
})
