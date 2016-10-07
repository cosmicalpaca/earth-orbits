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
     * @param {Number} [fontSize] - Size of the font. Default: 6
     */
    constructor(text, fontSize = 6) {
        this._canvas = document.createElement('canvas');
        this.size = 0.05 * fontSize;

        const DRAWING_SIZE = 64; // Drawing size essentially determines crispiness of resulting font
        const font = `bold ${DRAWING_SIZE}px sans-serif`;

        let context = this._canvas.getContext('2d');

        context.font = font;

        this._canvas.width = context.measureText(text).width;
        this._canvas.height = DRAWING_SIZE;

        context.font = font; // Because font size is reset after size change

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = 'white';
        context.fillText(text, this._canvas.width / 2, this._canvas.height / 2);

        context.strokeStyle = 'white';
        context.strokeText(text, this._canvas.width / 2, this._canvas.height / 2);

        this._texture = new THREE.Texture(this._canvas);
        this._texture.needsUpdate = true;
    }
}

/**
 * Creates instance of text as a sprite
 */
class SpriteText extends TextOnCanvas {
    constructor(text, size) {
        super(text, size);

        let material = new THREE.SpriteMaterial({
            map: this._texture,
            transparent: true,
            color: 0xffffff,
        });

        let sprite = new THREE.Sprite(material);
        sprite.scale.set(this.size, this.size * (this._canvas.height / this._canvas.width), 100);

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
            map: this._texture,
            color: 0xffffff,
            transparent: true,
        });

        let geometry = new THREE.PlaneGeometry(this.size, this.size * (this._canvas.height / this._canvas.width), 1, 1);

        this.mesh = new THREE.Mesh(geometry, material);
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
