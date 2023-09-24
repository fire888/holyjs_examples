// import * as THREE from "three";
// import { createStudio } from '../entities/studio'
// import { createLoadManager } from '../helpers/loadManager'
// import { ASSETS_TO_LOAD } from '../constants/ASSETS'
// import { M } from '../entities/structure/M'
// import { W, H } from '../entities/structure/constants'
// import { tile_I } from '../entities/structure/tile_I'
// import { tile_X } from '../entities/structure/tile_X'
// import { tile_L } from '../entities/structure/tile_L'
// import { tile_X_BT } from '../entities/structure/tile_X_BT'
// import { tile_H } from '../entities/structure/tile_H'
// import { tile_H_toH } from '../entities/structure/tile_H_toH'
// import { tile_T } from '../entities/structure/tile_T'
// import { tile_STAIRS } from '../entities/structure/tile_STAIRS'
// import { tile_B } from '../entities/structure/tile_B'
// import { tile_EMPTY } from '../entities/structure/tile_EMPTY'
// import { createDataTiles } from '../entities/structure/dataTiles'
// import { createLabel } from '../entities/structure/label'
// import { createBoxesLines } from '../entities/structure/gabarites'
//
// const TILES = {
//     tile_I,
//     tile_X,
//     tile_L,
//     tile_X_BT,
//     tile_H,
//     tile_H_toH,
//     tile_T,
//     tile_STAIRS,
//     tile_B,
//     tile_EMPTY,
// }
//
//
//
// const createMesh = (v, uv, c, material) => {
//     const geometry = new THREE.BufferGeometry()
//     const vF32 = new Float32Array(v)
//     geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
//     geometry.computeVertexNormals()
//     const uvF32 = new Float32Array(uv)
//     geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
//     const cF32 = new Float32Array(c)
//     geometry.setAttribute('color', new THREE.BufferAttribute(cF32, 3))
//     return new THREE.Mesh(geometry, material)
// }
//
//
// async function initApp () {
//     const studio = createStudio(3)
//     const assets = await createLoadManager(ASSETS_TO_LOAD)
//     const materials = {
//         'brickColor': new THREE.MeshPhongMaterial({
//             color: 0xFFFFFF,
//             map: assets.structureMap,
//             bumpMap: assets.structureMap,
//             bumpScale: .02,
//             vertexColors: true,
//         }),
//     }
//     const updateFunctions = []
//     let n = 0
//     const animate = () => {
//         requestAnimationFrame(animate)
//         n += .014
//         updateFunctions.forEach(fn => fn(n))
//         studio.render()
//     }
//     animate()
//
//     const offset = W * 1.5
//
//     const arrTiles = createDataTiles()
//     const v = []
//     const uv = []
//     const c = []
//     for (let i = 0; i < arrTiles.length; ++i) {
//
//         const data = TILES[arrTiles[i].keyModel]({})
//
//         const pos = [Math.floor( i / 5) * offset, Math.floor( i % 5) * (-offset) ]
//
//         M.rotateVerticesY(data.v, arrTiles[i].rotationY)
//         M.translateVertices(data.v, pos[0], 0, pos[1])
//         v.push(...data.v)
//         uv.push(...data.uv)
//         c.push(...data.c)
//
//         const l = createLabel(i)
//         l.position.set(pos[0] - W / 2, H + .1, pos[1] - W / 2)
//         studio.addToScene(l)
//
//         const boxLines = createBoxesLines(W / 3, H / 2, W / 3)
//         boxLines.position.set(pos[0] - W / 2, 0,  pos[1] - W / 2)
//         studio.addToScene(boxLines)
//
//         const { connectNX, connectPX, connectNZ, connectPZ, connectNY, connectPY } = arrTiles[i]
//         for (let c = 0; c < connectNX.length; ++c) {
//             const l = createLabel(connectNX[c], '#cc0000')
//             l.position.set(pos[0] - W * .55, H / 2, pos[1] -c * .2 + W * 0.4)
//             studio.addToScene(l)
//         }
//         for (let c = 0; c < connectPX.length; ++c) {
//             const l = createLabel(connectPX[c], '#cc0000')
//             l.position.set(pos[0] + W * .55, H / 2, pos[1] -c * .2 + W * 0.4)
//             studio.addToScene(l)
//         }
//         for (let c = 0; c < connectNZ.length; ++c) {
//             const l = createLabel(connectNZ[c], '#0000ff')
//             l.position.set(pos[0] - W * 0.4 + c * .28, H / 2 + .2, pos[1] - W / 2)
//             studio.addToScene(l)
//         }
//         for (let c = 0; c < connectPZ.length; ++c) {
//             const l = createLabel(connectPZ[c], '#0000ff')
//             l.position.set(pos[0] - W * 0.4 + c * .28, H / 2 - .2, pos[1] + W / 2)
//             studio.addToScene(l)
//         }
//         for (let c = 0; c < connectNY.length; ++c) {
//             const l = createLabel(connectNY[c], '#00aa00')
//             l.position.set(pos[0] - W * 0.4 + c * .28, -.3, pos[1])
//             studio.addToScene(l)
//         }
//         for (let c = 0; c < connectPY.length; ++c) {
//             const l = createLabel(connectPY[c], '#00aa00')
//             l.position.set(pos[0] - W * 0.4 + c * .28, H + .3, pos[1] )
//             studio.addToScene(l)
//         }
//     }
//     const mesh = createMesh(v, uv, c, materials.brickColor)
//     studio.addToScene(mesh)
//
//
//     /** CUSTOM 00 **************************/
//     {
//
//     }
// }
//
//
// window.addEventListener('load', () => {
//     initApp().then()
// })
