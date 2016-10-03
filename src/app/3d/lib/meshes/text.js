const THREE = require('THREE');
const fonts = require('../fonts');

/**
 * Creates a mesh that is a text with a given size
 */
class Text {
    /**
     * @param {String} text
     * @param {Number} [size]
     */
    constructor(text, size = 0.1) {
        let geometry = new THREE.TextGeometry(text, {
            font: fonts.getFont(),
            size: size,
            height: 0.001,
            curveSegments: 1,
        });

        let material = new THREE.MeshBasicMaterial({
            transparent: true,
        });

        let mesh = new THREE.Mesh(geometry, material);

        this.mesh = mesh;
    }
}

module.exports = Text;
