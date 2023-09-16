import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export const createStudio = (startCameraZ = 3) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById( 'webgl-canvas' ),
        antialias: true,
    })
    renderer.setClearColor(0x333333)
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

    const dirLight = new THREE.DirectionalLight( 0xffffff, 1)
    dirLight.position.set(0, 300, 200)
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 500
    dirLight.shadow.camera.bottom = -500
    dirLight.shadow.camera.left = -500
    dirLight.shadow.camera.right = 500
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 1000
    scene.add(dirLight)

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000, 1, 1),
        new THREE.ShadowMaterial( { color: 0x000011, opacity: .2, side: THREE.DoubleSide })
    )
    ground.rotation.x = - Math.PI / 2
    ground.position.y = -1
    ground.receiveShadow = true
    scene.add(ground)



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


    let phase = 5.3

    return {
        render: () => {
            if (!camera ) {
                return;
            }
            phase += 0.001
            dirLight.position.x = Math.sin(phase) * 150 - 75
            dirLight.position.z = Math.cos(phase) * 50 + 300
            dirLight.position.y = Math.sin(phase * 25) * 100 + 400
            renderer.render(scene, camera)
        },
        addToScene: mesh => {
            scene.add(mesh)
        },
    }
}
