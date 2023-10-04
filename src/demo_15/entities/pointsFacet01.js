export const FACET11 = (() => {
    const startAngle = Math.PI
    const endAngle = Math.PI * 1.5
    const n = 7
    const R = 6
    const step = Math.abs(endAngle - startAngle) / (n - 1)

    const arr = [0, 0, 0]
    for (let i = 1; i < n; ++i) {
        arr.push(
            Math.cos(startAngle + (i * step)) * R + R,
            Math.sin(startAngle - (i * step)) * R,
            0,
        )
    }
    arr.push(
        arr[arr.length - 3],
        arr[arr.length - 2] + 1.5,
        arr[arr.length - 1],
    )
    return {
        type: 'dataFacetPoints',
        name: 'facet11',
        h: R + 1.5,
        w: 6,
        points: arr,
    }
})()
