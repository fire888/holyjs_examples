import { rotateArrY, translateArr, createFace } from "../../helpers/geomHelpers";
import { FACET44 } from '../../schemes/schemeFacet44'

export const createInner = (params, t) => {
    const v = []

    if (!params.facetInner) {
        v.push(...createFace(t.wsi, t.esi, t.eni, t.wni))
    } else {
        const { count, rotationY } = params.facetInner
        const w = t.esi[0] - t.wsi[0]
        const d = t.wsi[2] - t.wni[2]
        if (rotationY === 0 || rotationY === '0') {
            const facetW = FACET44.w

            const facetVertices = []
            const { points } = FACET44
            for (let i = 1; i < points.length; ++i) {
                const pPrev = points[i - 1]
                const pNext = points[i]

                facetVertices.push(
                    ...createFace(
                        [pPrev[0], pPrev[1] + params.h, -d],
                        [pPrev[0], pPrev[1] + params.h, 0],
                        [pNext[0], pNext[1] + params.h, 0],
                        [pNext[0], pNext[1] + params.h, -d],
                    )
                )
            }



            const emptyW = (w - (facetW * count)) / (count + 1)
            const segmentW = emptyW + facetW

            for (let i = 0; i < count + 1; ++i) {
                v.push(
                    ...createFace(
                    [segmentW * i, params.h, -d],
                    [segmentW * i, params.h, 0],
                    [segmentW * i + emptyW, params.h, 0],
                    [segmentW * i + emptyW, params.h, -d],
                    )
                )
                if (i < count) {
                    const copyFacetVertices = [...facetVertices]
                    translateArr(copyFacetVertices, segmentW * i + emptyW, 0, 0)
                    v.push(...copyFacetVertices)
                }
            }

            translateArr(v, t.wsi[0], 0, t.wsi[2])
        } else {

            const facetW = FACET44.w

            const facetVertices = []
            const { points } = FACET44
            for (let i = 1; i < points.length; ++i) {
                const pPrev = points[i - 1]
                const pNext = points[i]

                facetVertices.push(
                    ...createFace(
                        [pPrev[0], pPrev[1] + params.h, -w],
                        [pPrev[0], pPrev[1] + params.h, 0],
                        [pNext[0], pNext[1] + params.h, 0],
                        [pNext[0], pNext[1] + params.h, -w],
                    )
                )
            }



            const emptyW = (d - (facetW * count)) / (count + 1)
            const segmentW = emptyW + facetW

            for (let i = 0; i < count + 1; ++i) {
                v.push(
                    ...createFace(
                    [segmentW * i, params.h, -w],
                    [segmentW * i, params.h, 0],
                    [segmentW * i + emptyW, params.h, 0],
                    [segmentW * i + emptyW, params.h, -w],
                    )
                )
                if (i < count) {
                    const copyFacetVertices = [...facetVertices]
                    translateArr(copyFacetVertices, segmentW * i + emptyW, 0, 0)
                    v.push(...copyFacetVertices)
                }
            }

            rotateArrY(v, Math.PI / 2)
            translateArr(v, t.wsi[0] + w, 0, t.wsi[2])
        }
    }

    return {
        v,
    }
}
