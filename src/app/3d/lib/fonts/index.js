const THREE = require('three');

const FONTS = {
    serif: 'fonts/droid_serif_bold.typeface.json',
    sans: 'fonts/droid_sans_regular.typeface.json',
};

class FontHelper {
    loadFont(style = 'sans') {
        return new Promise(resolve => {
            let fontLoader = new THREE.FontLoader();
            fontLoader.load(FONTS[style], response => {
                this[style] = response;
                resolve(response);
            });
        });
    }

    getFont(style = 'sans') {
        return this[style];
    }

}

module.exports = new FontHelper();
