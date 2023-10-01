import { hideStartScreen } from '../ui/hideStartScreen'
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../entities/loadManager'
import { startFrameUpdater  } from '../utils/createFrameUpater'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'
import { createDoor } from '../entities/door'
import { createBox } from '../entities/box'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import * as THREE from "three";
import { ARR_STATES } from '../constants/animations'
import { createBox00 } from '../entities/box00/box00'
import { FACET11 } from '../schemes/schemeFacet11'
import { BOX00_SCHEME } from '../schemes/shemeBox00'
import { PARAMS_GUI } from '../constants/gui'

const root = {}


const initApp = () => {
    root.studio = createStudio(root)
    root.loadManager = createLoadManager()

    root.loadManager.startLoad(ASSETS_TO_LOAD).then(assets => {
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

        const box = createBox00(root, BOX00_SCHEME)
        box.mesh.castShadow = true
        root.studio.addToScene(box.mesh)

        root.frameUpdater = startFrameUpdater(root)
        root.frameUpdater.on(n => {
            root.studio.render()
        })
        const gui = new GUI()
        hideStartScreen(root, () => {

            const update = () => {}

            gui.add(BOX00_SCHEME, 'w')
                .min(PARAMS_GUI.params['w'].min)
                .max(PARAMS_GUI.params['w'].max)
                .onChange(v => {
                    BOX00_SCHEME['w'] = v
                    box.change(BOX00_SCHEME)
                })
                .listen()

            gui.add(BOX00_SCHEME, 'h')
                .min(PARAMS_GUI.params['h'].min)
                .max(PARAMS_GUI.params['h'].max)
                .onChange(v => {
                    BOX00_SCHEME['h'] = v
                    box.change(BOX00_SCHEME)
                })
                .listen()

            gui.add(BOX00_SCHEME, 'd')
                .min(PARAMS_GUI.params['d'].min)
                .max(PARAMS_GUI.params['d'].max)
                .onChange(v => {
                    BOX00_SCHEME['d'] = v
                    box.change(BOX00_SCHEME)
                })
                .listen()

            gui.add(BOX00_SCHEME.facetS, 'type', ['FACET11', /*'FACET14',*/ 'FACET12', 'FACET13'])
                .onChange(v => {
                    BOX00_SCHEME.facetS.type = v
                    box.change(BOX00_SCHEME)
                })
                .listen()

            gui.add(BOX00_SCHEME.facetT, 'offsetX')
                .min(PARAMS_GUI.params['offsetfacet'].min)
                .max(PARAMS_GUI.params['offsetfacet'].max)
                .onChange(v => {
                    BOX00_SCHEME.facetT.offsetX = v
                    box.change(BOX00_SCHEME)
                })
                .listen()

            gui.add(BOX00_SCHEME.facetT, 'offsetZ')
                .min(PARAMS_GUI.params['offsetfacet'].min)
                .max(PARAMS_GUI.params['offsetfacet'].max)
                .onChange(v => {
                    BOX00_SCHEME.facetT.offsetZ = v
                    box.change(BOX00_SCHEME)
                })
                .listen()

            gui.add(BOX00_SCHEME.facetT, 'type', ['FACET22', 'FACET33'])
                .onChange(v => {
                    BOX00_SCHEME.facetT.type = v
                    box.change(BOX00_SCHEME)
                })
                .listen()


            gui.add(BOX00_SCHEME.facetInner, 'count', 0, 10, 1)
                .onChange(v => {
                    BOX00_SCHEME.facetInner.count = v
                    box.change(BOX00_SCHEME)
                })
                .listen()


            gui.add(BOX00_SCHEME.facetInner, 'rotationY', ['0', '90'])
                .onChange(v => {
                    BOX00_SCHEME.facetInner.rotation = v
                    box.change(BOX00_SCHEME)
                })
                .listen()

            gui.open()
        })
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
