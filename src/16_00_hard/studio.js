import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const createStudio = (startCameraCoord = 3) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById( 'webgl-canvas' ),
        antialias: true,
    })
    renderer.setClearColor(0x1c0e1e)
    renderer.setPixelRatio( window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000011, 5, 12)

    // const axesHelper = new THREE.AxesHelper(1)
    // scene.add(axesHelper)
    // const gridHelper = new THREE.GridHelper(1, 10)
    // scene.add(gridHelper)

    const lightA = new THREE.AmbientLight( 0xffffff, 1)
    scene.add( lightA )

    const dir1 = new THREE.DirectionalLight( 0xffffff, 1)
    dir1.position.set(0, 5, 3)
    scene.add(dir1)

    const dir2 = new THREE.DirectionalLight( 0xffffff, .5)
    dir2.position.set(0, -5, -3)
    scene.add(dir2)

    const controlsCam = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000)
    controlsCam.position.set(0, startCameraCoord, startCameraCoord)
    const controls = new OrbitControls(controlsCam, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.update()
    let camera = controlsCam 

    const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        if (camera) {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }
    }
    window.addEventListener('resize', resize)

    return {
        camera,
        render: () => {
            if (!camera ) {
                return;
            }
            renderer.render(scene, camera)
        },
        addToScene: mesh => {
            scene.add(mesh)
        },
        removeFromScene: mesh => {
            scene.remove(mesh)
        },
        setCam(cam) {
            scene.fog.far = 12
            camera = cam
        },
        setCamPos(x, y, z) {
            camera.position.set(x, y, z)
            controls.update()
        },
        enableControls () {
            scene.fog.far = 10000
            camera = controlsCam
        }
    }
}
