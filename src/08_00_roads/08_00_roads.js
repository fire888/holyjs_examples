import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { createLoadManager } from '../helpers/loadManager'
import { ASSETS_TO_LOAD } from './ASSETS'
import { ClickerOnScene } from "../helpers/clickerOnScene"
import { createSchemeLines } from './schemeLines'
import { M } from './M'
import { Player } from './player'
import { updateEveryFrame } from "../helpers/frameUpdater";


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

async function initApp () {
    const studio = createStudio(7)
    updateEveryFrame(studio.render)
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

    /** CUSTOM 00 **************************/
    let mesh = null
    const wallMaxAtlas = 4
    const cornerMinAtlas = 8
    const cornerMaxAtlas = 8
    let result = null
    let isCanClick = true

    async function createStructure (points) {
        result = await createSchemeLines(studio, points)

        const H = 1

        const v = []
        const uv = []

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
                    v.push(
                        ...p1.toArray(),
                        ...p0.toArray(),
                        ...p2.toArray(),
                    )
                } else {
                    v.push(...M.createPolygon(
                        p1.toArray(),
                        p0.toArray(),
                        [p0.x, H, p0.z],
                        [p1.x, H, p1.z],
                    ))
                    v.push(
                        ...p0.toArray(),
                        ...p1.toArray(),
                        ...p2.toArray()
                    )
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
        updateEveryFrame(player.update.bind(player))
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
