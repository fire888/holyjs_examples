import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export class Player extends THREE.PerspectiveCamera {
    constructor (x = 0, y = 0, z = 0, arrToCollision) {
        super(75, window.innerWidth / window.innerHeight, .01, 1000)

        this._arrToCollision = arrToCollision

        this.position.set(x, y, z)
        this.controls = new PointerLockControls(this, document.body)
        this.controls.minPolarAngle = .5
        this.controls.maxPolarAngle = Math.PI - .5

        this.bottomObj = new THREE.Object3D()
        this.bottomObj.position.set(0, -1, 0)
        this.add(this.bottomObj)

        document.body.addEventListener('click', () => {
            this.controls.lock()
        })

        this._forward = false
        document.addEventListener('keydown', e => {
            if (e.code === 'ArrowUp') {
                this._forward = true
            }
        })
        document.addEventListener('keyup', e => {
            if (e.code === 'ArrowUp') {
                this._forward = false
            }
        })

        this._maxOffsetToDrop = .5
        this._minOffsetToNotDrop = .48
        this._vecDir = new THREE.Vector3()
        this._rayCaster = new THREE.Raycaster(this.position, this._vecDir)
    }

    update () {
        const [ isCollision, distance ] = this._checkCollisions()
        if (isCollision) {
            if (distance < this._minOffsetToNotDrop) {
                this.translateY(this._minOffsetToNotDrop - distance)
            }
        } else {
            this.position.y -= .005
        }

        if (this._forward) {
            this.translateZ(-.01)
        }
    }

    _checkCollisions () {
        this.bottomObj.getWorldPosition(this._vecDir)

        this._vecDir.sub(this.position)

        const intersects = this._rayCaster.intersectObjects(this._arrToCollision)

        if (intersects[0] && intersects[0].distance < this._maxOffsetToDrop) {
            return [true, intersects[0].distance]
        }
        return [false, null]
    }
}
