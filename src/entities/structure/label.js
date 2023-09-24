import * as THREE from 'three'

let geomLabel = new THREE.PlaneGeometry(.3, .3)

export const createLabel = (t, color = "#FFFF00") => {
    const canvas = document.createElement( 'canvas' );
    const ctx = canvas.getContext( '2d' );
    canvas.width = 128;
    canvas.height = 128;

    // ctx.fillStyle = bgColor;
    // ctx.fillRect( 0, 0, 128, 128 );

    ctx.fillStyle = color
    ctx.font = 'bold 60pt arial'
    ctx.textAlign = "center"
    ctx.fillText(t, 64, 100)

    const map = new THREE.CanvasTexture( canvas )
    const material = new THREE.MeshBasicMaterial( { map: map, transparent: true } );
    return new THREE.Mesh(geomLabel, material)
}
