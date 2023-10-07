import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../entities/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import { ClickerOnScene } from "../entities/clickerOnScene"
import diff from '../assets/map_brick_diff_1.jpg'
import { createSchemeLines } from './schemeLines'
import { M } from './M'


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
        x < 0 && y > 0 && (rad = Math.PI - Math.abs(rad))
        x < 0 && y <= 0 && (rad = Math.PI + Math.abs(rad))
        rad += Math.PI * 6
        rad = rad % (Math.PI * 2)
        return -rad
    }
}

const createMesh = (v, uv, c, material) => {
    const geometry = new THREE.BufferGeometry()
    const vF32 = new Float32Array(v)
    geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    geometry.computeVertexNormals()
    const cF32 = new Float32Array(c)
    geometry.setAttribute('color', new THREE.BufferAttribute(cF32, 3))
    const uvF32 = new Float32Array(uv)
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
    return new THREE.Mesh(geometry, material)
}

const color1 = [.9, .9, .9]
const color1_6 = [...color1,...color1,...color1,...color1,...color1,...color1,]
const color2 = [.5, .7, 1]
const color2_6 = [...color2,...color2,...color2,...color2,...color2,...color2,]
const color3 = [.7, .5, .2]
const color3_6 = [...color3,...color3,...color3,...color3,...color3,...color3,]
const uvEmpty = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const uvFull = [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
const uvHalf = [0, 0, 1, 0, 1, .2, 0, 0, 1, .2, 0, .2]

async function initApp () {
    const studio = createStudio(7)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
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
            color: 0xffffff,
            flatShading: false,
            vertexColors: true,
            map: new THREE.TextureLoader().load(diff),
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

    createSchemeLines(studio).then(result => {
        const v = []
        const uv = []
        for(let i = 0; i < result.length; ++i) {
            console.log(result[i])
            if (result[i].type === 'corridor') {
                const { leftLine, rightLine } = result[i]
                v.push(...M.createPolygon(
                    [leftLine.p0.x, 0, leftLine.p0.z],
                    [leftLine.p1.x, 0, leftLine.p1.z],
                    [leftLine.p1.x, 3, leftLine.p1.z],
                    [leftLine.p0.x, 3, leftLine.p0.z],
                ))
                uv.push(0,0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1)
                v.push(...M.createPolygon(
                    [rightLine.p1.x, 0, rightLine.p1.z],
                    [rightLine.p0.x, 0, rightLine.p0.z],
                    [rightLine.p0.x, 3, rightLine.p0.z],
                    [rightLine.p1.x, 3, rightLine.p1.z],
                ))
                uv.push(0,0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1)
            }
        }
        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
        geometry.computeVertexNormals()
        const uvF32 = new Float32Array(uv)
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
        studio.addToScene(new THREE.Mesh(geometry, materials.atlasBrick))
    })


}


window.addEventListener('load', () => {
    initApp().then()
})
