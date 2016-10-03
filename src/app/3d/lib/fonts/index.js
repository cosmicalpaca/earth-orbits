const THREE = require('three');

const FONTS = {
    'droid-serif': 'fonts/droid_serif_bold.typeface.json',
    'droid-sans': 'fonts/droid_sans_regular.typeface.json',
    'helvetiker-bold': 'fonts/helvetiker_bold.typeface.json',
};

class FontHelper {
    loadFont(style = 'helvetiker-bold') {
        return new Promise(resolve => {
            let fontLoader = new THREE.FontLoader();
            fontLoader.load(FONTS[style], response => {
                this[style] = response;
                resolve(response);
            });
        });
    }

    getFont(style = 'helvetiker-bold') {
        return this[style];
    }

}

module.exports = new FontHelper();
