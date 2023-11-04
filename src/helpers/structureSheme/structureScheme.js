import { createMap } from './map'

export const generateStructureScheme = (data) => {
    return new Promise(res => {
        console.log('dataTiles', data)
        const o = {
            SIZE_X: data.numW,
            SIZE_Y: data.numH,
            SIZE_Z: data.numD,
        }
        const dataStructure = createMap(data.tiles)
        dataStructure.generateMap(o).then(r => {
            console.log('resultStructure', r)
            res(r)
        })
    })

}
