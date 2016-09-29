const THREE = require('three');

function loadFont() {
    return new Promise((resolve) => {
        let fontLoader = new THREE.FontLoader();

        fontLoader.load('fonts/droid_serif_bold.typeface.json', (response) => {
            resolve(response);
        });
    })
}

module.exports = {
    loadFont
};
