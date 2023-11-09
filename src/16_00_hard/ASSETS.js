import mapBrickStructureDiff from '../assets/map_structure_brick_diff.jpg'
import pan from '../assets/Street View 360.jpg'
import { KEYS_LOADERS } from '../helpers/loadManager'

export const ASSETS_TO_LOAD = [
    { assetType: KEYS_LOADERS.IMG, fileName: mapBrickStructureDiff, key: 'mapStructureBrickDiff', },
    { assetType: KEYS_LOADERS.IMG, fileName: pan, key: 'pan', },
]
