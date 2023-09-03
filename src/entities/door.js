import * as THREE from 'three'

const createDoorGeometry = (params) => {
    let v = []
    let vG = []

    const updatePoints = () => {
        const {
            w = 50,
            h = 50,
            z = 3,
            frame = 5,
            z2 = 1.5,
            frame2 = 5,
            z3 = 3,
            frame3 = 5
        } = params


        v = []

        /** box ******/
        v.push(
            0, 0, 0, // 0
            w, 0, 0, // 1
            w, h, 0, // 2
            0, h, 0, // 3

            0, 0, z, // 4
            w, 0, z, // 5
            w, h, z, // 6
            0, h, z, // 7
        )

        /** front frame ***/
        v.push(
            frame, frame, z,          // 8
            w - frame, frame, z,      // 9
            w - frame, h - frame, z,  // 10
            frame, h - frame, z,      // 11
        )

        /** frame 2 ****/
        v.push(
            frame + frame2, frame + frame2, z2, // 12
            w - frame - frame2, frame + frame2, z2, // 13
            w - frame - frame2, h - frame - frame2, z2, // 14
            frame + frame2, h - frame - frame2, z2, // 15
        )

        /** mirror *****/
        v.push(
            frame + frame2 + frame3, frame + frame2 + frame3, z2 + z3, // 16
            w - frame - frame2 - frame3, frame + frame2 + frame3, z2 + z3, // 17
            w - frame - frame2 - frame3, h - frame - frame2 - frame3, z2 + z3, // 18
            frame + frame2 + frame3, h - frame - frame2 - frame3, z2 + z3, // 19
        )



        vG = []
        vG.push(
            0, 0, 0,
            0, h, 0,
            w, h, 0,
            w, 0, 0,
            0, 0, 0,

            0, 0, z,
            0, h, z,
            0, h, 0,
            0, h, z,
            w, h, z,
            w, h, 0,
            w, h, z,
            w, 0, z,
            w, 0, 0,
            w, 0, z,
            0, 0, z,
        )
    }

    updatePoints()


    const i = []
    const uv = []

    uv.push(
        0, 0, // 0
        1, 0, // 1
        1, 1, // 2
        0, 1, // 3

        0, 0, // 4
        1, 0, // 5
        1, 1, // 6
        0, 1, // 7
    )

    i.push(
        1, 0, 3, 1, 3, 2,  //back
        0, 4, 7, 0, 7 , 3, // left
        7, 6, 2, 7, 2, 3,  // top
        5, 1, 2, 5, 2, 6,  // right
        0, 1, 5, 0, 5, 4,  // bottom
    )

    uv.push(
        .2, .2,
        .8, .2,
        .8, .8,
        .2, .8,
    )

    i.push(
        4, 5, 9, 4, 9, 8, // bottom
        5, 6, 10, 5, 10, 9, // right
        5, 6, 10, 5, 10, 9, // left
        4, 8, 11, 4, 11, 7, // right
        11, 10, 6, 11, 6, 7, // top
    )


    uv.push(
        .2, .2, // 8
        .8, .2, // 9
        .8, .8, // 10
        .2, .8, // 11
    )

    i.push(
        8, 9, 13, 8, 13, 12,
        13, 9, 10, 13, 10, 14,
        15, 14, 10, 15, 10, 11,
        11, 8, 12, 11, 12, 15,
    )

    uv.push(
        0, 0, // 12
        1, 0, // 13
        1, 1, // 14
        0, 2, // 15
    )

    i.push(
        12, 13, 17, 12, 17, 16,
        17, 13, 14, 17, 14, 18,
        19, 18, 14, 19, 14, 15,
        12, 16, 19, 12, 19, 15,
    )

    uv.push(
        0, 0, // 16
        1, 0, // 17
        1, 1, // 18
        0, 2, // 19
    )

    i.push(
        16, 17, 18, 16, 18, 19,
    )



    const geometry = new THREE.BufferGeometry()
    const vF32 = new Float32Array(v)
    geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    const uvF32 = new Float32Array(uv)
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))
    geometry.setIndex(i)
    geometry.computeVertexNormals()
    geometry.addGroup(0, 84, 0)
    geometry.addGroup(84, 30, 1)


    const geometryGeom = new THREE.BufferGeometry()
    const vG_F32 = new  Float32Array(vG)
    geometryGeom.setAttribute('position', new THREE.BufferAttribute(vG_F32, 3))

    const updateParams = () => {
        v = []
        updatePoints()
        for (let i = 0; i < v.length; ++i) {
            vF32[i] = v[i]
        }
        for (let i = 0; i < vG.length; ++i) {
            vG_F32[i] = vG[i]
        }
        geometry.attributes.position.needsUpdate = true
        geometryGeom.attributes.position.needsUpdate = true
    }


    return {
        geometry,
        geometryGeom,
        setParams: p => {
            params = p
            updateParams()
        },
    }
}


export const createDoor = (root, params) => {
    const geometryDoor = createDoorGeometry(params)

    const mesh = new THREE.Mesh(
        geometryDoor.geometry,
        root.materials,
    )


    const material = new THREE.LineBasicMaterial({ color: 0x888888 })
    const meshGeom = new THREE.Line(geometryDoor.geometryGeom, material)

    return {
        meshGeom,
        mesh,
        ...geometryDoor,
    }
}