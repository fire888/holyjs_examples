import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { createLoadManager } from '../helpers/loadManager'
import { Player } from "../helpers/player"
import { ASSETS_TO_LOAD } from './ASSETS'
import { M } from './helpersMeshes/M'
import { W, H } from './CONSTANTS'
import { TILES } from "./tilesGeometry/TILES";
import { createDataTiles } from './dataTiles/dataTiles'
import { createBoxesLines } from './helpersMeshes/gabaritesLines'
import { updateEveryFrame } from "../helpers/frameUpdater"
import { createLabel } from "./helpersMeshes/label"
import { createMap } from './structureScheme/map'

const button = document.createElement('button')
button.innerText = 'WALK'
document.body.appendChild(button)
button.style.position = 'absolute'
button.style.zIndex = '100'
button.style.top = '0'
let f = null



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
    const studio = createStudio(3)
    studio.setCamPos(10, 15, 23)
    studio.setCamTargetPos(10, 0, 5)
    updateEveryFrame(studio.render)
    const assets = await createLoadManager(ASSETS_TO_LOAD)
    const materials = {
        'brickColor': new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: assets.structureMap,
            bumpMap: assets.structureMap,
            bumpScale: .02,
            vertexColors: true,
        }),
        'simple': new THREE.MeshPhongMaterial({
            color: 0xFF3333,
            transparent: true,
            opacity: .8,
        })
    }

    const fullfloor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const lines = [1, 2]
    const x = [4]
    const corners = [4, 5, 6, 7]
    const tCrosses = [8, 9, 10, 11]
    const xBT = [12, 13]
    const topPlatform = [15, 16, 17, 18]
    const toBottom = [22, 23, 24, 25]
    const stairs = [19, 20, 21]


    // перекрестки непересекающиеся
    //const { arrTiles, resultTiles } = createDataTiles([...xBT])

    // без лестниц круговых блоки
    //const { arrTiles, resultTiles } = createDataTiles([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 16, 17, 18, 22, 23, 24, 25])

    // круговые лестницы
    //const { arrTiles, resultTiles } = createDataTiles([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 16, 17, 18, 22, 23, 24, 25])

    // bottom top
    //const { arrTiles, resultTiles } = createDataTiles([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25])

    //all
    const { arrTiles, resultTiles } = createDataTiles([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25])

    const
        SIZE_X = 9,
        SIZE_Y = 2,
        SIZE_Z = 6,
        mapFill = [],
        dataForMap = { tiles: resultTiles, mapFill, SIZE_X, SIZE_Y, SIZE_Z }

    const l = createBoxesLines(W, H, W, SIZE_X, SIZE_Y, SIZE_Z)
    l.position.set(-W / 2, 0, -W / 2)
    studio.addToScene(l)

    /** create level ***********************/
    const map = createMap(dataForMap.tiles, studio, materials)
    const preparedLevelData = await map.generateMap(dataForMap)

    /** create hidden collisions for player ********/
    const v = []
    const uv = []
    const c = []
    const vCollision = []

    preparedLevelData.iterateAll(item => {
        const { numX, numY, numZ, tileData } = item
        if (tileData) {
            const elem = TILES[tileData.keyModel]({})
            M.rotateVerticesY(elem.v, tileData.rotationY)
            M.translateVertices(elem.v, numX * W, numY * H, numZ * W)
            v.push(...elem.v)
            uv.push(...elem.uv)
            c.push(...elem.c)

            M.rotateVerticesY(elem.col, tileData.rotationY)
            M.translateVertices(elem.col, numX * W, numY * H, numZ * W)
            vCollision.push(...elem.col)
        }
    })

    const meshCollision = createMesh(vCollision, uv, c, materials.simple)
    meshCollision.visible = false
    studio.addToScene(meshCollision)

    /** player *****************/
    let isPlayer = false
    let player = null
    button.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isPlayer) {
            if (!player) {
                player = new Player(
                    SIZE_X * W / 2,
                    SIZE_Y * H / 2 + 1,
                    SIZE_Z * W / 2,
                    [meshCollision]
                )
                updateEveryFrame(player.update.bind(player))
            }
            isPlayer = true
            player.enable()
            studio.setCam(player)
        } else {
            isPlayer = false
            player.disable()
            studio.enableControls()
        }
    })

    /** show all tiles ********************/
    for (let i = 0; i < arrTiles.length; ++i) {
        const v = []
        const uv = []
        const c = []

        if (arrTiles[i].keyModel) {
            const elem = TILES[arrTiles[i].keyModel]({})
            M.rotateVerticesY(elem.v, arrTiles[i].rotationY)
            M.translateVertices(elem.v, (W + .1) * i, 0, -9)
            v.push(...elem.v)
            uv.push(...elem.uv)
            c.push(...elem.c)
            const label = createLabel(i, '#ff0000', 3)
            label.position.set((W + .1) * i, 2.5, -9)
            studio.addToScene(label)
        }

        const mesh = createMesh(v, uv, c, materials.brickColor)
        studio.addToScene(mesh)
    }

    /** show exists tiles ********************/
    for (let i = 0; i < resultTiles.length; ++i) {
        const v = []
        const uv = []
        const c = []

        if (resultTiles[i].keyModel) {
            const elem = TILES[resultTiles[i].keyModel]({})
            M.rotateVerticesY(elem.v, resultTiles[i].rotationY)
            M.translateVertices(elem.v, (W + .1) * i, 0, -5)
            v.push(...elem.v)
            uv.push(...elem.uv)
            c.push(...elem.c)
        }

        const mesh = createMesh(v, uv, c, materials.brickColor)
        studio.addToScene(mesh)
    }
}


window.addEventListener('load', () => {
    initApp().then()
})
