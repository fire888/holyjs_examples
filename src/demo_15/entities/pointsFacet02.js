/**

 .                         .
 .                         .
 .                         .
    .                .
        .        .
             .
 */


export const FACET12 = (() => {
    const arr = [
        0, 0, 0,
        0, -1, 0,
        1, -1, 0,
        5, -9,  0,
        7, -9, 0,
        13, -1, 0,
        14, -1, 0,
        14, 0, 0
    ]

    return {
        type: 'dataFacetPoints',
        name: 'facet33',
        h: 9,
        w: 14,
        points: arr,
    }
})()
