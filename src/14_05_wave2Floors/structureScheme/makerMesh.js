import {tile_I} from "../structure/tile_I";
import {tile_X} from "../structure/tile_X";
import {tile_L} from "../structure/tile_L";
import {tile_X_BT} from "../structure/tile_X_BT";
import {tile_H} from "../structure/tile_H";
import {tile_H_toH} from "../structure/tile_H_toH";
import {tile_T} from "../structure/tile_T";
import {tile_STAIRS} from "../structure/tile_STAIRS";
import {tile_B} from "../structure/tile_B";
import {tile_EMPTY} from "../structure/tile_EMPTY";
import { W, H } from '../structure/constants'
import { M } from '../structure/M'
import * as THREE from "three";

const TILES = {
    tile_I,
    tile_X,
    tile_L,
    tile_X_BT,
    tile_H,
    tile_H_toH,
    tile_T,
    tile_STAIRS,
    tile_B,
    tile_EMPTY,
}

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
        console.log(data.tileData.keyModel)
        const t = TILES[data.tileData.keyModel]()

        M.rotateVerticesY(t.v, data.tileData.rotationY)
        M.translateVertices(t.v, W * data.k, H * data.i, W * data.j)

        const m = createMesh(t.v, t.uv, t.c, materials.brickColor)
        return m
    }
}
