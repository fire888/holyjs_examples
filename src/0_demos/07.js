import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import { ClickerOnScene } from "../entities/clickerOnScene";

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
    const studio = createStudio(10)
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

    let currentWall

    const createWalls = (path) => {

        const createDataWalls = path => {
            const pathV = path.map(item => new THREE.Vector3().fromArray(item))
            const dataWalls = pathV.map((item, i, arr) => {
                const prevIndex = arr[i - 1] ? i - 1 : arr.length - 1
                const v = new THREE.Vector3().copy(item).sub(arr[prevIndex])
                const angle = m.angleFromCoords(v.x, v.z)
                return {
                    angle,
                    w: arr[prevIndex].distanceTo(item),
                    p1: arr[prevIndex],
                    p2: item,
                }
            })
            dataWalls.forEach((item, i, arr) => {
                const prevInd = arr[i - 1] ? i - 1 : arr.length - 1
                const nextInd = arr[i + 1] ? i + 1 : 0
                item.angle1 = -(item.angle - arr[prevInd].angle) / 2
                if (Math.abs(item.angle1) > Math.PI / 2) {
                    item.angle1 += Math.PI
                }
                item.angle2 = (arr[nextInd].angle - item.angle) / 2
                if (Math.abs(item.angle2) > Math.PI / 2) {
                    item.angle2 += Math.PI
                }
            })
            return dataWalls
        }


        const createWall = (W, H, profileB, angle1, angle2) => {
            const v = []
            const uv = []

            const l = [...profileB]
            const lx = [...l]

            m.rotateVerticesY(l, angle1)
            m.rotateVerticesY(lx, angle2)
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

        const fullP = assets.profiles.children.filter(item => item.name === 'profile3')[0].geometry.attributes.position.array

        const dataWalls = createDataWalls(path)

        const v = []
        const uv = []
        for (let i = 0; i < dataWalls.length; ++i) {
            const { w, angle, p1, angle1, angle2 } = dataWalls[i]
            const wall = createWall(w, 3, fullP, angle1, angle2)
            m.rotateVerticesY(wall.v, angle)
            m.translateVertices(wall.v, p1.x, 0, p1.z)
            v.push(...wall.v)
            uv.push(...wall.uv)
        }

        const mesh = createMesh(v, uv, materials.phongWhite)
        studio.addToScene(mesh)

        currentWall = mesh
    }

    const path = []

    const clickerOnScene = new ClickerOnScene()
    clickerOnScene.camera = studio.camera
    studio.addToScene(clickerOnScene)
    clickerOnScene.setCB(p => {
        const ob = new THREE.Mesh(
            new THREE.BoxGeometry(.2,.2, .2),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        )
        ob.position.copy(p)
        studio.addToScene(ob)
        path.push(p.toArray())
        if (currentWall) {
            studio.removeFromScene(currentWall)
            currentWall.geometry.dispose()
            currentWall.material.dispose()
        }
        path.length > 2 && createWalls(path)
    })
}


window.addEventListener('load', () => {
    initApp().then()
})
