import { createMap } from './map'

export const generateStructureScheme = (data, studio) => {
    return new Promise(res => {
        console.log('dataTiles', data)
        const o = {
            SIZE_X: data.numW,
            SIZE_Y: data.numH,
            SIZE_Z: data.numD,
        }
        const generator = createMap(data.tiles, studio)
        generator.generateMap(o).then(r => {
            console.log('resultStructure', r)
            res(r)
        })
    })

}
