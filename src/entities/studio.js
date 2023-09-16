import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const createStudio = (startCameraZ = 3) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById( 'webgl-canvas' ),
        antialias: true,
    })
    renderer.setClearColor(0x000000)
    renderer.setPixelRatio( window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 300, 3000)

    const axesHelper = new THREE.AxesHelper(1)
    scene.add(axesHelper)
    const gridHelper = new THREE.GridHelper(1, 10)
    scene.add(gridHelper)

    const lightA = new THREE.AmbientLight( 0xffffff, .5)
    scene.add( lightA )

    const l = new THREE.PointLight( 0xffffff, 1)
    l.position.set(1.5, 2, 2)
    scene.add(l)

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 20000)
    camera.position.set(0, 2, startCameraZ)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.update()

    const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        if (camera) {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }
    }
    window.addEventListener('resize', resize)

    return {
        render: () => {
            if (!camera ) {
                return;
            }
            renderer.render(scene, camera)
        },
        addToScene: mesh => {
            scene.add(mesh)
        },
    }
}
