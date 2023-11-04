import profiles from '../assets/profiles.obj'
import map from '../assets/map_brick_diff_1.jpg'
import { KEYS_LOADERS } from '../helpers/loadManager'


export const ASSETS_TO_LOAD = [
    { assetType: KEYS_LOADERS.IMG, fileName: map, key: 'mapBrickDiff', },
    { assetType: KEYS_LOADERS.OBJ, fileName: profiles, key: 'profiles', },
]
