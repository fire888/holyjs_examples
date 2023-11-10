import * as THREE from 'three'
import { M } from './M'
import { FACET11 } from './pointsFacet01'
import { FACET12 } from './pointsFacet02'
import { FACET13 } from './pointsFacet03'

const FACETS = {
    FACET11,
    FACET12,
    FACET13,
}

const uv6 = M.createUv([0, 0],[1, 0], [1, 1], [0, 1])

const createDoorGeometry = (params) => {
    let v = []
    let uv = []
    const updatePoints = () => {
        const { w = 50, h = 50, z = 3, frame = 5, z2 = 1.5, frame2 = 5, z3 = 3, frame3 = 5 } = params
        v = []
        uv = []
        v.push(
            ...M.createPolygon( // back
                [w, 0, 0],
                [0, 0, 0],
                [0, h, 0],
                [w, h, 0],
            ),
            ...M.createPolygon( // left
                [0, 0, 0],
                [0, 0, z],
                [0, h, z],
                [0, h, 0],
            ),
            ...M.createPolygon( // right
                [w, 0, z],
                [w, 0, 0],
                [w, h, 0],
                [w, h, z],
            ),
            ...M.createPolygon( // bottom
                [0, 0, 0],
                [w, 0, 0],
                [w, 0, z],
                [0, 0, z],
            ),
            ...M.createPolygon( // top
                [0, h, z],
                [w, h, z],
                [w, h, 0],
                [0, h, 0],
            ),
        )
        uv.push(...uv6)
        uv.push(...uv6)
        uv.push(...uv6)
        uv.push(...uv6)
        uv.push(...uv6)

        const pr1 = FACETS[params.facet1.type].points
        const pr2 = FACETS[params.facet2.type].points

        const facet2 = [...pr2]
        M.translateVertices(facet2, frame, pr1[pr1.length - 2], 0)

        const mirrorV = [
            facet2[facet2.length - 3],
            facet2[facet2.length - 2],
            0,
            facet2[facet2.length - 3] + frame2,
            facet2[facet2.length - 2] + z2,
            0,
        ]

        const result = [
            ...pr1,
            ...facet2,
        ]

        const profile0 = [...result]
        M.rotateVerticesY(profile0, Math.PI / 4)
        const mirrorPr0 = [...mirrorV]
        M.rotateVerticesY(mirrorPr0, Math.PI / 4)
        const end0 = [
            mirrorPr0[mirrorPr0.length - 3],
            mirrorPr0[mirrorPr0.length - 2],
            mirrorPr0[mirrorPr0.length - 1],
        ]

        const profile1 = [...result]
        M.rotateVerticesY(profile1,  Math.PI / 4 * 3)
        M.translateVertices(profile1, w, 0, 0)
        const mirrorPr1 = [...mirrorV]
        M.rotateVerticesY(mirrorPr1,  Math.PI / 4 * 3)
        M.translateVertices(mirrorPr1, w, 0, 0)
        const end1 = [
            mirrorPr1[mirrorPr1.length - 3],
            mirrorPr1[mirrorPr1.length - 2],
            mirrorPr1[mirrorPr1.length - 1],
        ]

        const profile2 = [...result]
        M.rotateVerticesY(profile2,  Math.PI / 4 * 5)
        M.translateVertices(profile2, w, 0, -h)
        const mirrorPr2 = [...mirrorV]
        M.rotateVerticesY(mirrorPr2,  Math.PI / 4 * 5)
        M.translateVertices(mirrorPr2, w, 0, -h)
        const end2 = [
            mirrorPr2[mirrorPr2.length - 3],
            mirrorPr2[mirrorPr2.length - 2],
            mirrorPr2[mirrorPr2.length - 1],
        ]

        const profile3 = [...result]
        M.rotateVerticesY(profile3,  Math.PI / 4 * 7)
        M.translateVertices(profile3, 0, 0, -h)
        const mirrorPr3 = [...mirrorV]
        M.rotateVerticesY(mirrorPr3,  Math.PI / 4 * 7)
        M.translateVertices(mirrorPr3, 0, 0, -h)
        const end3 = [
            mirrorPr3[mirrorPr3.length - 3],
            mirrorPr3[mirrorPr3.length - 2],
            mirrorPr3[mirrorPr3.length - 1],
        ]


        const vProfile = []
        for (let i = 3; i < profile0.length; i += 3) {
            vProfile.push(
                ...M.createPolygon(
                    [profile0[i - 3], profile0[i - 2], profile0[i - 1]],
                    [profile1[i - 3], profile1[i - 2], profile1[i - 1]],
                    [profile1[i], profile1[i + 1], profile1[i + 2]],
                    [profile0[i], profile0[i + 1], profile0[i + 2]],
                )
            )
            vProfile.push(
                ...M.createPolygon(
                    [profile1[i - 3], profile1[i - 2], profile1[i - 1]],
                    [profile2[i - 3], profile2[i - 2], profile2[i - 1]],
                    [profile2[i], profile2[i + 1], profile2[i + 2]],
                    [profile1[i], profile1[i + 1], profile1[i + 2]],
                )
            )
            vProfile.push(
                ...M.createPolygon(
                    [profile2[i - 3], profile2[i - 2], profile2[i - 1]],
                    [profile3[i - 3], profile3[i - 2], profile3[i - 1]],
                    [profile3[i], profile3[i + 1], profile3[i + 2]],
                    [profile2[i], profile2[i + 1], profile2[i + 2]],
                )
            )
            vProfile.push(
                ...M.createPolygon(
                    [profile3[i - 3], profile3[i - 2], profile3[i - 1]],
                    [profile0[i - 3], profile0[i - 2], profile0[i - 1]],
                    [profile0[i], profile0[i + 1], profile0[i + 2]],
                    [profile3[i], profile3[i + 1], profile3[i + 2]],
                )
            )
        }
        for (let i = 3; i < mirrorPr0.length; i += 3) {
            vProfile.push(
                ...M.createPolygon(
                    [mirrorPr0[i - 3], mirrorPr0[i - 2], mirrorPr0[i - 1]],
                    [mirrorPr1[i - 3], mirrorPr1[i - 2], mirrorPr1[i - 1]],
                    [mirrorPr1[i], mirrorPr1[i + 1], mirrorPr1[i + 2]],
                    [mirrorPr0[i], mirrorPr0[i + 1], mirrorPr0[i + 2]],
                )
            )
            vProfile.push(
                ...M.createPolygon(
                    [mirrorPr1[i - 3], mirrorPr1[i - 2], mirrorPr1[i - 1]],
                    [mirrorPr2[i - 3], mirrorPr2[i - 2], mirrorPr2[i - 1]],
                    [mirrorPr2[i], mirrorPr2[i + 1], mirrorPr2[i + 2]],
                    [mirrorPr1[i], mirrorPr1[i + 1], mirrorPr1[i + 2]],
                )
            )
            vProfile.push(
                ...M.createPolygon(
                    [mirrorPr2[i - 3], mirrorPr2[i - 2], mirrorPr2[i - 1]],
                    [mirrorPr3[i - 3], mirrorPr3[i - 2], mirrorPr3[i - 1]],
                    [mirrorPr3[i], mirrorPr3[i + 1], mirrorPr3[i + 2]],
                    [mirrorPr2[i], mirrorPr2[i + 1], mirrorPr2[i + 2]],
                )
            )
            vProfile.push(
                ...M.createPolygon(
                    [mirrorPr3[i - 3], mirrorPr3[i - 2], mirrorPr3[i - 1]],
                    [mirrorPr0[i - 3], mirrorPr0[i - 2], mirrorPr0[i - 1]],
                    [mirrorPr0[i], mirrorPr0[i + 1], mirrorPr0[i + 2]],
                    [mirrorPr3[i], mirrorPr3[i + 1], mirrorPr3[i + 2]],
                )
            )
        }
        vProfile.push(
            ...M.createPolygon(end0, end1, end2, end3)
        )
        uv.push(...uv6)

        M.translateVertices(vProfile, 0, z, 0)
        M.rotateVerticesX(vProfile, Math.PI / 2)
        v.push(...vProfile)

        const uvPr = M.getUvByLen(vProfile, 1)
        uv.push(...uvPr)
    }

    updatePoints()

    const geometry = new THREE.BufferGeometry()
    const vF32 = new Float32Array(v)
    geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    const uvF32 = new Float32Array(uv)
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
    geometry.computeVertexNormals()
    geometry.addGroup(0, 390, 0)
    geometry.addGroup(390, 30, 1)

    const updateParams = () => {
        v = []
        uv = []
        updatePoints()
        for (let i = 0; i < v.length; ++i) {
            vF32[i] = v[i]
        }
        geometry.attributes.position.needsUpdate = true
        for (let i = 0; i < uv.length; ++i) {
            uvF32[i] = uv[i]
        }
        geometry.attributes.uv.needsUpdate = true
    }


    return {
        geometry,
        setParams: p => {
            params = p
            updateParams()
        },
    }
}


export const createDoor = (root, params) => {
    const geometryDoor = createDoorGeometry(params)

    const mesh = new THREE.Mesh(geometryDoor.geometry, root.materials)
    return {
        mesh,
        ...geometryDoor,
    }
}
