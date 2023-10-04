import * as THREE from 'three'
import { M } from './M'

const uvPolygon = M.createUv([0, 0],[ 1, 0,], [1, 1], [0, 1])

const createDoorGeometry = (params) => {
    let v = []
    let uv = []

    const updatePoints = () => {
        const { w = 50, h = 50, zBox = -30, tBox = 2 } = params
        v = []
        uv = []

        v.push(
            ...M.createPolygon(  // left
                [0, 0, zBox],
                [0, 0, 0],
                [0, h, 0],
                [0, h, zBox],
            ),
            ...M.createPolygon( // top
                [0, h, 0],
                [w, h, 0],
                [w, h, zBox],
                [0, h, zBox],
            ),
            ...M.createPolygon( // right
                [w, 0, 0],
                [w, 0, zBox],
                [w, h, zBox],
                [w, h, 0],
            ),
            ...M.createPolygon( // bottom
                [w, 0, 0],
                [0, 0, 0],
                [0, 0, zBox],
                [w, 0, zBox],
            ),
            ...M.createPolygon( // back
                [w, 0, zBox],
                [0, 0, zBox],
                [0, h, zBox],
                [w, h, zBox],
            ),
        )
        uv.push(...uvPolygon, ...uvPolygon, ...uvPolygon, ...uvPolygon, ...uvPolygon)

        v.push(
            ...M.createPolygon( // bottom
                [tBox, tBox, 0,],
                [w - tBox, tBox, 0,],
                [w - tBox, tBox, zBox + tBox,],
                [tBox, tBox, zBox + tBox,],
            ),
            ...M.createPolygon( // left
                [tBox, tBox, 0,],
                [tBox, tBox, zBox + tBox,],
                [tBox, h - tBox, zBox + tBox,],
                [tBox, h - tBox, 0],
            ),
            ...M.createPolygon( // right
                [w - tBox, tBox, zBox + tBox,],
                [w - tBox, tBox, 0,],
                [w - tBox, h - tBox, 0,],
                [w - tBox, h - tBox, zBox + tBox,],
            ),
            ...M.createPolygon( // back
                [tBox, tBox, zBox + tBox,],
                [w - tBox, tBox, zBox + tBox,],
                [w - tBox, h - tBox, zBox + tBox,],
                [tBox, h - tBox, zBox + tBox,],
            ),
            ...M.createPolygon( // top
                [w - tBox, h - tBox, 0, ],
                [tBox, h - tBox, 0,],
                [tBox, h - tBox, zBox + tBox,],
                [w - tBox, h - tBox, zBox + tBox,],
            ),
        )
        uv.push(...uvPolygon, ...uvPolygon, ...uvPolygon, ...uvPolygon, ...uvPolygon)

        const vThick = [
            ...M.createPolygon( // thickness left
                [0, 0, 0],
                [tBox, tBox, 0],
                [tBox, h - tBox, 0],
                [0, h, 0],
            ),
            ...M.createPolygon( // thickness bottom
                [0, 0, 0],
                [w, 0, 0],
                [w - tBox, tBox, 0],
                [tBox, tBox, 0],
            ),
            ...M.createPolygon( // thickness right
                [w - tBox, tBox, 0],
                [w, 0, 0],
                [w, h, 0],
                [w - tBox, h - tBox, 0],
            ),
            ...M.createPolygon( // thickness top
                [tBox, h - tBox, 0],
                [w - tBox, h - tBox, 0],
                [w, h, 0],
                [0, h, 0],
            ),
        ]
        v.push(...vThick)
        const uvThick = M.getUvByLen(vThick)
        uv.push(...uvThick)
    }

    updatePoints()

    const geometry = new THREE.BufferGeometry()
    const vF32 = new Float32Array(v)
    geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    const uvF32 = new Float32Array(uv)
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
    geometry.computeVertexNormals()

    const updateParams = () => {
        v = []
        updatePoints()
        for (let i = 0; i < v.length; ++i) {
            vF32[i] = v[i]
        }
        geometry.attributes.position.needsUpdate = true
    }


    return {
        geometry,
        setParams: p => {
            params = p
            updateParams()
        },
    }
}


export const createBox = (root, params) => {
    const geometryBox = createDoorGeometry(params)
    const mesh = new THREE.Mesh(geometryBox.geometry, root.materials[0])
    return {mesh, ...geometryBox}
}
