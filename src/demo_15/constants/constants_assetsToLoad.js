import nx from '../../assets/nx.jpg'
import px from '../../assets/px.jpg'
import nz from '../../assets/nz.jpg'
import pz from '../../assets/pz.jpg'
import ny from '../../assets/ny.jpg'
import py from '../../assets/py.jpg'

import wMap from '../../assets/streaky-plywood_albedo.png'
import wAOMap from '../../assets/streaky-plywood_ao.png'
import wHeightMap from '../../assets/streaky-plywood_height.png'
import wNormalMap from '../../assets/streaky-plywood_normal-ogl.png'



export const ASSETS_TO_LOAD = [
    {
        type: 'cubeTextures',
        filename: [px, nx, py, ny, nz, pz],
        key: 'skyBox'
    },
    {
        type: 'img',
        filename: wMap,
        key: 'wMap',
    },
    {
        type: 'img',
        filename: wAOMap,
        key: 'wAOMap',
    },
    {
        type: 'img',
        filename: wNormalMap,
        key: 'wNormalMap',
    },
    {
        type: 'img',
        filename: wHeightMap,
        key: 'wHeightMap',
    },
]
