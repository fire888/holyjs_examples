import * as THREE from "three";
import { createStudio } from './studio'
import { createRooms } from './createRooms'
import consA0Src from '../assets/broken_down_concrete2_ao.jpg'
import consNormSrc from '../assets/broken_down_concrete2_Normal-dx.jpg'
import { updateEveryFrame } from "../helpers/frameUpdater";

async function initApp () {
    const studio = createStudio(3)
    updateEveryFrame(studio.render)
    studio.setCamPos(0, 1000, -500)
    const root = { studio }
    root.materials = {
        'iron' : new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            lightMapIntensity: .35,
            aoMap: new THREE.TextureLoader().load(consA0Src),
            normalMap: new THREE.TextureLoader().load(consNormSrc),
            normalScale: new THREE.Vector2(.1, .1),
            reflectivity: .02,
            shininess: 100,
            specular: 0x020201,
            vertexColors: true,
        }),
    }


    const town = createRooms(root)

    // const meshCollision = createMesh(vCollision, uv, c, materials.simple)
    // meshCollision.visible = false
    // studio.addToScene(meshCollision)

    // const player = new Player(6, 5,6, [])
    // studio.setCam(player)
    // updateFunctions.push(() => { player.update() })
}


window.addEventListener('load', () => {
    initApp().then()
})
