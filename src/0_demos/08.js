import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import { topElem } from '../entities/archStructure/topElem'
import { column } from '../entities/archStructure/column'
import { columnSimple } from '../entities/archStructure/columnSimple'
import { arc } from '../entities/archStructure/arc'
import { createStructure } from '../entities/archStructure/structure'
import { M } from '../entities/archStructure/M'
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



async function initApp () {
    const studio = createStudio(20)
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
    // const v = []
    // const uv = []
    //
    // const color1 =  [.3, .3, .5]
    // const color2 =  [1, 1, .5]
    //
    // const elemT = createTopElem({ h: .5, r: .05, color1, color2 })
    // const mesh = createMesh(elemT.v, elemT.uv, elemT.c,  materials.brickColor)
    // mesh.position.set(0, 0, 0)
    // studio.addToScene(mesh)
    //
    // const columnVery = column({ h: 1, r: .05,  color1, color2  })
    // const mesh1 = createMesh(columnVery.v, columnVery.uv, columnVery.c,  materials.brickColor)
    // mesh1.position.set(.5, 0, 0)
    // studio.addToScene(mesh1)
    //
    // const arcD = arc({ h: .5, w: .5, color1, color2 })
    // const mesh2 = createMesh(arcD.v, arcD.uv, arcD.c, materials.brickColor)
    // mesh2.position.set(1, 0, 0)
    // studio.addToScene(mesh2)
    //
    // const c2 = columnSimple({ h: .5, r: .05, color1, color2 })
    // const mesh3 = createMesh(c2.v, c2.uv, c2.c, materials.brickColor)
    // mesh3.position.set(1.5, 0, 0)
    // studio.addToScene(mesh3)

    /** CUSTOM 02 ************************************/
    const arch = {
        column,
        columnSimple,
        arc,
        topElem
    }

    const v = []
    const uv = []
    const c = []

    const st = createStructure()
    console.log(st)
    for (let i = 0; i < st.length; ++i) {
        const { type, h, r, color1, color2, x, y, z, rot } = st[i]
        const e = arch[type](st[i])
        console.log(type, e)
        M.rotateVerticesY(e.v, rot + hPI)
        M.translateVertices(e.v, x, y, z)
        v.push(...e.v)
        uv.push(...e.uv)
        c.push(...e.c)
    }
    const mesh3 = createMesh(v, uv, c, materials.brickColor)
    mesh3.position.set(0, 0, 0)
    studio.addToScene(mesh3)
}


window.addEventListener('load', () => {
    initApp().then()
})
