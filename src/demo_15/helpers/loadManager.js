import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


export const createLoadManager = () => {
    const assets = {}

    let objLoader, textureLoader, gltfLoader, fbxLoader, cubeTextureLoader
    let index = 0
    let onLoad = () => {}
    let ASSETS_TO_LOAD = []


    const checkComplete = () => {
        index ++
        if ( index < ASSETS_TO_LOAD.length ) {
            loadAsset(ASSETS_TO_LOAD[index])
        } else {
            onLoad(assets)
        }
    }

    const loadAsset = data => {
        if (data.type === 'obj') {
            objLoader.load(data.filename, model => {
                assets[data.key] = model
                checkComplete()        
            })
        }
        if (data.type === 'glb' || data.type === 'gltf') {
            gltfLoader.load(data.filename, model => {
                assets[data.key] = model
                checkComplete()        
            })
        }   
        if (data.type === 'fbx') {
            fbxLoader.load(data.filename, model => {
                assets[data.key] = model 
                checkComplete()      
            })
        }        
        if (data.type === 'img') {
            textureLoader.load(data.filename, model => {
                model.wrapS = model.wrapT = THREE.RepeatWrapping;
                assets[data.key] = model
                checkComplete()        
            })
        }
        if (data.type === 'gltfBin') {
            const dracoLoader = new DRACOLoader()
            dracoLoader.setDecoderPath('draco/gltf/')
            dracoLoader.setDecoderConfig({type: 'js'})
            gltfLoader.setDRACOLoader( dracoLoader )

            gltfLoader.load(data.filename, model => {
                assets[data.key] = model
                checkComplete()
            })
        }
        if (data.type === 'cubeTextures') {
            cubeTextureLoader.load(data.filename, model => {
                assets[data.key] = model
                checkComplete()
            })
        }
    }



    return {
        startLoad: ASSETS_DATA => {
            return new Promise(res => {

                ASSETS_TO_LOAD = ASSETS_DATA
                onLoad = res
                index = 0

                objLoader = new OBJLoader()
                gltfLoader = new GLTFLoader()
                textureLoader = new THREE.TextureLoader()
                fbxLoader = new FBXLoader()
                cubeTextureLoader = new THREE.CubeTextureLoader()

                loadAsset(ASSETS_TO_LOAD[index])
            })
        }
    }
}