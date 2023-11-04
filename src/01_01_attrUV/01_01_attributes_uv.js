import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { updateEveryFrame } from '../helpers/frameUpdater'
import map from "../assets/map_brick_diff.jpg";

const { sin, cos } = Math

async function initApp () {
    const studio = createStudio()
    studio.setBackColor(0x333333)
    studio.setCamTargetPos(1.7, .5, 0)
    updateEveryFrame(studio.render)
    const materials = {
        'brick': new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            map: new THREE.TextureLoader().load(map),
        }),
    }

    /** CUSTOM 00_00 ***********************************/

    {
        const geometry = new THREE.BufferGeometry()


        const v = [
            0, 0, 0,
            1, 0, 0,
            1, 2, 0,

            0, 0, 0,
            1, 2, 0,
            0, 2, 0,
        ]

        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))

        const uv = [
            0, 0,
            1, 0,
            1, 1,

            0, 0,
            1, 1,
            0, 1,
        ]

        const uvF32 = new Float32Array(uv)
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvF32, 2))

        const mesh = new THREE.Mesh(geometry, materials.brick)
        mesh.position.x = 1.2
        studio.addToScene(mesh)

        updateEveryFrame(n => {
            geometry.attributes.position.array[0] = sin(n * 5)
            geometry.attributes.position.array[9] = sin(n * 5)
            geometry.attributes.position.needsUpdate = true

            const v = sin(n * 5) * .02
            geometry.attributes.uv.array[0] += v
            geometry.attributes.uv.array[2] += v
            geometry.attributes.uv.array[6] += v

            geometry.attributes.uv.needsUpdate = true
        })
    }

    /** *******************************************/
}


window.addEventListener('load', () => {
    initApp().then()
})
