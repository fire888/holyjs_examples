import * as THREE from "three";
import { W, H } from '../structure/constants'
import { M } from '../structure/M'
import { TILES } from '../tilesGeometry/TILES'



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



export const createMakerMesh = (materials) => {
    return data => {
        if (!data.tileData || !data.tileData.keyModel) {
            return null
        }
        const t = TILES[data.tileData.keyModel]()

        M.rotateVerticesY(t.v, data.tileData.rotationY)
        M.translateVertices(t.v, W * data.k, H * data.i, W * data.j)

        const m = createMesh(t.v, t.uv, t.c, materials.brickColor)
        return m
    }
}
