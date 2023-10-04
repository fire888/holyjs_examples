import { createStudio } from './entities/studio'
import { createLoadManager } from '../entities/loadManager'
import { startFrameUpdater  } from './utils/createFrameUpater'
import { ASSETS_TO_LOAD } from './constants/constants_assetsToLoad'
import { createDoor } from './entities/door'
import { createBox } from './entities/box'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import * as THREE from "three";
import { ARR_STATES } from './constants/animations'


const PARAMS = {
    door: {
        openAngle: -.5,
        w: 80,
        h: 80,
        z: 5,
        frame: 15,
        z2: 3,
        frame2: 5,
        z3: 3,
        frame3: 5,

        zBox: -50,
        tBox: 7,
    }
}


const PARAMS_GUI = {
    animate: true,
    receiveShadow: false,
    door: {
        w: {
            min: 30,
            max: 150,
        },
        h: {
            min: 30,
            max: 300,
        },
        z: {
            min: 2,
            max: 15,
        },
        frame: {
            min: 5,
            max: 30,
        },
        z2: {
            min: 1,
            max: 30,
        },
        frame2: {
            min: 0,
            max: 15,
        },
        z3: {
            min: 0,
            max: 40,
        },
        frame3: {
            min: 0,
            max: 15,
        },
        openAngle: {
            min: -Math.PI,
            max: 0,
        },
        zBox: {
            min: -150,
            max: -20,
        },
        tBox: {
            min: 1,
            max: 15,
        },
    },
}

const root = {}

const initApp = () => {
    root.studio = createStudio(root)
    createLoadManager(ASSETS_TO_LOAD).then(assets => {
        root.assets = assets

        root.materials = [
            new THREE.MeshPhongMaterial({
                color: 0x333333,
                lightMap: assets['wAOMap'],
                lightMapIntensity: .35,
                normalMap: assets['wNormalMap'],
                normalScale: new THREE.Vector2(.2, .2),
                envMap: assets['skyBox'],
                map: assets['wMap'],
                reflectivity: .002,
                shininess: 100,
                specular: 0x333333,
                flatShading: true,
            }),
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                envMap: assets['skyBox'],
                reflectivity: 1,
                shininess: 50,
                specular: 0xffffff,
                flatShading: true,
            }),
            new THREE.MeshPhongMaterial({
                color: 0x111111,
            }),
        ]


        const door = createDoor(root, PARAMS.door)
        console.log('^^^^', door)
        door.mesh.receiveShadow = PARAMS_GUI.receiveShadow
        door.mesh.castShadow = true
        root.studio.addToScene(door.mesh)
        door.mesh.rotation.y = PARAMS.door.openAngle
        door.meshGeom.rotation.y = PARAMS.door.openAngle
        door.meshGeom.position.x = -300
        root.studio.addToScene(door.meshGeom)

        const box = createBox(root, PARAMS.door)
        box.mesh.receiveShadow = PARAMS_GUI.receiveShadow
        box.mesh.castShadow = true
        root.studio.addToScene(box.mesh)

        let updaterParams = null
        let currentStateIndex = 0
        const createUpdater = () => {
            ++currentStateIndex
            if (currentStateIndex === ARR_STATES.length) {
                currentStateIndex = 0
            }
            updaterParams = animateToNew(ARR_STATES[currentStateIndex], v => {
                door.setParams(v)
                door.mesh.rotation.y = v.openAngle
                door.meshGeom.rotation.y = v.openAngle
                box.setParams(v)
                for (let key in v) {
                    PARAMS.door[key] = v[key]
                }
            }, createUpdater)
        }
        createUpdater()


        root.frameUpdater = startFrameUpdater(root)
        root.frameUpdater.on(n => {
            if (PARAMS_GUI.animate) {
                updaterParams && updaterParams.update()
            }
            root.studio.render()
        })
        const gui = new GUI()
        gui.add( PARAMS_GUI,'animate')
        gui.add( PARAMS_GUI,'receiveShadow').onChange(v =>  {
            box.mesh.receiveShadow = v
            door.mesh.receiveShadow = v
        })
        for (let key in PARAMS.door) {
            gui.add(PARAMS.door, key).min( PARAMS_GUI.door[key].min).max(PARAMS_GUI.door[key].max).onChange(v => {
                PARAMS.door[key] = v
                door.setParams(PARAMS.door)
                box.setParams(PARAMS.door)
                door.mesh.rotation.y = PARAMS.door.openAngle
                door.meshGeom.rotation.y = PARAMS.door.openAngle
            }).listen()
        }
        gui.open()
    })
}


const animateToNew = (target, onUpdate, oncomplete) => {
    let phase = 0
    const spd = 0.005
    let savedParams = { ...PARAMS.door }
    let targetParams = {...target.door}
    let currentParams = { ...savedParams }

    return {
        update: () => {
            phase += spd
            if (phase > 1) {
                phase = 1
            }
            for (let key in targetParams) {
                currentParams[key] = savedParams[key] + phase * (targetParams[key] - savedParams[key])
            }
            onUpdate(currentParams)
            if (phase === 1) {
                oncomplete()
            }
        }
    }
}




window.addEventListener('load', initApp)
