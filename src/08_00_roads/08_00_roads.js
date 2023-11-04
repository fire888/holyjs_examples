import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from './ASSETS'
import { ClickerOnScene } from "../helpers/clickerOnScene"
import diff from '../assets/map_brick_diff_1.jpg'
import { createSchemeLines } from './schemeLines'
import { M } from './M'
import { Player } from './player'


const button = document.createElement('button')
button.innerText = 'WALK'
document.body.appendChild(button)
button.style.position = 'absolute'
button.style.zIndex = '100'
button.style.top = '0'
let f = null


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
    arr.push(
        [h * 3, h * 3,
        h * 4, h * 3,
        h * 3 + h / 2, h * 4,]
    )
    return arr
})()
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
    studio.setBackColor(0x333333)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    const materials = {
        'atlasBrick': new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: assets.atlasBrickDiff2,
            bumpMap: assets.atlasBrickDiff2,
            bumpScale: .02,
            //wireframe: true
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
    let mesh = null
    const wallMaxAtlas = 4
    const cornerMinAtlas = 8
    const cornerMaxAtlas = 8
    let result = null
    let isCanClick = true

    async function createStructure (points) {
        result = await createSchemeLines(studio, points)

        const v = []
        const uv = []
        const H = 1
        for(let i = 0; i < result.length; ++i) {
            if (result[i].type === 'corridor') {
                const { leftLine, rightLine } = result[i]
                v.push(...M.createPolygon(
                    [leftLine.p0.x, 0, leftLine.p0.z],
                    [leftLine.p1.x, 0, leftLine.p1.z],
                    [leftLine.p1.x, H, leftLine.p1.z],
                    [leftLine.p0.x, H, leftLine.p0.z],
                ))
                uv.push(...atlas[Math.floor(Math.random() * wallMaxAtlas)])
                v.push(...M.createPolygon(
                    [rightLine.p1.x, 0, rightLine.p1.z],
                    [rightLine.p0.x, 0, rightLine.p0.z],
                    [rightLine.p0.x, H, rightLine.p0.z],
                    [rightLine.p1.x, H, rightLine.p1.z],
                ))
                uv.push(...atlas[Math.floor(Math.random() * wallMaxAtlas)])
                // road
                v.push(
                    ...M.createPolygon(
                        [leftLine.p0.x, 0, leftLine.p0.z],
                        [rightLine.p0.x, 0, rightLine.p0.z],
                        [rightLine.p1.x, 0, rightLine.p1.z],
                        [leftLine.p1.x, 0, leftLine.p1.z],
                    )
                )
                uv.push(...atlas[13])
            }
            if (result[i].type === 'cross') {
                const { p0, p1, p2, p3 } = result[i]
                v.push(...M.createPolygon(
                        p0.toArray(),
                        p1.toArray(),
                        p2.toArray(),
                        p3.toArray(),
                ))
                uv.push(...atlas[14])
            }
            if (result[i].type === 'corner') {
                const { p0, p1, p2, dir } = result[i]
                if (dir === 'p2_p1_p0') {
                    v.push(...M.createPolygon(
                        p0.toArray(),
                        p1.toArray(),
                        [p1.x, H, p1.z],
                        [p0.x, H, p0.z],
                    ))
                    v.push(...p1.toArray(), ...p0.toArray(), ...p2.toArray(),)
                } else {
                    v.push(...M.createPolygon(
                        p1.toArray(),
                        p0.toArray(),
                        [p0.x, H, p0.z],
                        [p1.x, H, p1.z],
                    ))
                    v.push(...p0.toArray(), ...p1.toArray(), ...p2.toArray())
                }
                uv.push(...atlas[cornerMinAtlas + Math.floor((cornerMaxAtlas - cornerMinAtlas) * Math.random())])
                uv.push(...atlas[atlas.length - 1])
            }
        }
        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
        geometry.computeVertexNormals()
        const uvF32 = new Float32Array(uv)
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
        if (mesh) {
            mesh.geometry.dispose()
            studio.removeFromScene(mesh)
        }
        mesh = new THREE.Mesh(geometry, materials.atlasBrick)
        studio.addToScene(mesh)
    }

    const f = (e) => {
        e.preventDefault()
        e.stopPropagation()
        button.removeEventListener('click', f)
        isCanClick = false
        let playerPos
        for (let i = 0; i < result.length; ++i) {
            if (result[i].type === 'corridor' && result[i].prevId === null) {
                const {p0, p1} = result[i].axis
                playerPos = new THREE.Vector3().copy(p1).sub(p0).add(p0)
                playerPos.y = 1
            }
        }

        studio.setBackColor(0x4f3210)
        studio.setFog(0.5, 7, 0x56420d)
        const player = new Player(...playerPos.toArray(), [mesh])
        updateFunctions.push(player.update.bind(player))
        studio.setCam(player)
    }
    button.addEventListener("click", f)


    // const path = [
    //     [0, 0, 0],
    //     [11, 0, -2],
    //     [5, 0, 5],
    //     [3, 0, 5],
    //     [10, 0, -5],
    //     [5, 0, -3],
    //     [2, 0, 3],
    //     [15, 0, 3],
    // ]
    // createStructure(path)
    const path = []

    const clickerOnScene = new ClickerOnScene()
    clickerOnScene.camera = studio.camera
    studio.addToScene(clickerOnScene)
    clickerOnScene.setCB(p => {
        if (!isCanClick) {
            return;
        }
        const ob = new THREE.Mesh(
            new THREE.BoxGeometry(.2,.2, .2),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        )
        ob.position.set(p.x, -.5, p.z)
        studio.addToScene(ob)
        path.push(p.toArray())
        createStructure(path)
    })
}


window.addEventListener('load', () => {
    initApp().then()
})
