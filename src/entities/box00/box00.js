import * as THREE from 'three'
import { createSide } from './side'
import { createTopPr } from './topProfile'
import { createInner } from "./inner";

import { rotateArrY, translateArr, createFace } from "../../helpers/geomHelpers";

const createDoorGeometry = (params) => {
    //console.log(params)
    let v = []

    const s = createSide(params)
    v.push(...s.v)

    
    const t = createTopPr(params)
    v.push(...t.v)


    v.push(...createFace(s.wst, s.est, t.eso, t.wso))
    v.push(...createFace(s.wnt, s.wst, t.wso, t.wno))
    v.push(...createFace(t.eso, s.est, s.ent, t.eno))
    v.push(...createFace(t.wno, t.eno, s.ent, s.wnt))


    /** cap top */
    const i = createInner(params, t)
    v.push(...i.v)



    const geometry = new THREE.BufferGeometry()
    const vF32 = new Float32Array(v)
    geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    geometry.computeVertexNormals()

    return {
        geometry,
        setParams: p => {
            params = p
        },
    }
}


export const createBox00 = (root, params) => {
    let geometryBox = createDoorGeometry(params)


    const mesh = new THREE.Mesh(
        geometryBox.geometry,
        root.materials[0],
    )

    const material = new THREE.LineBasicMaterial({ color: 0x888888 })
    const meshGeom = new THREE.Line(
        geometryBox.geometryGeom,
        material
    )

    return {
        meshGeom,
        mesh,
        ...geometryBox,
        change: params => {
            geometryBox.geometry.dispose()
            geometryBox = createDoorGeometry(params)
            mesh.geometry = geometryBox.geometry 
        }
    }
}
