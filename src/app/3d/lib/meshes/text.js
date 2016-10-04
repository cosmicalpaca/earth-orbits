const THREE = require('THREE');
const m = require('math');

/**
 * @file: Classes to crete text
 */

/**
 * TextOnCanvas
 * Draws text on a canvas
 */
class TextOnCanvas {
    /**
     * @param {String} text       - Text to write
     * @param {Number} [fontSize] - Size of the font. Default: 8
     */
    constructor(text, fontSize = 6) {
        this.canvas = document.createElement('canvas');
        this.size = 0.05 * fontSize;

        const DRAWING_SIZE = 64; // Drawing size essentially determines crispiness of resulting font
        const font = `bold ${DRAWING_SIZE}px sans-serif`;

        let context = this.canvas.getContext('2d');

        context.font = font;

        this.canvas.width = context.measureText(text).width;
        this.canvas.height = DRAWING_SIZE;

        context.font = font; // Because font size is reset after size change

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = 'white';
        context.fillText(text, this.canvas.width / 2, this.canvas.height / 2);

        context.strokeStyle = 'white';
        context.strokeText(text, this.canvas.width / 2, this.canvas.height / 2);

        this.texture = new THREE.Texture(this.canvas);
        this.texture.needsUpdate = true;
    }
}

/**
 * Creates instance of text as a sprite
 */
class SpriteText extends TextOnCanvas {
    constructor(text, size) {
        super(text, size);

        let material = new THREE.SpriteMaterial({
            map: this.texture,
            transparent: true,
            color: 0xffffff,
        });

        let sprite = new THREE.Sprite(material);
        sprite.scale.set(this.size, this.size * (this.canvas.height / this.canvas.width), 100);

        this.mesh = sprite;
    }
}

/**
 * Creates instance of text on a plane geometry
 */
class PlaneText extends TextOnCanvas {
    constructor(text, size) {
        super(text, size);

        let material = new THREE.MeshBasicMaterial({
            map: this.texture,
            color: 0xffffff,
            transparent: true,
        });

        let geometry = new THREE.PlaneGeometry(this.size, this.size * (this.canvas.height / this.canvas.width), 1, 1);

        this.mesh = THREE.Mesh(geometry, material);
    }
}

/**
 * Creates instance of text as a sprite, positioned at given lat/long
 */
class SpriteTextOnSurface extends SpriteText {
    constructor(text, lat, long) {
        super(text);
        this.mesh.position.set(...m.latlongToCartesian(lat, long).multiplyScalar(1.02).toArray());
    }
}

module.exports = {
    Sprite: SpriteText,
    Plane: PlaneText,
    SpriteTextOnSurface,
};
