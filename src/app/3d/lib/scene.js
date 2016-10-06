const THREE = require('three');
const Earth = require('./meshes/earth');
const f = require('flags');

function createSceneObjects() {
    let objects = {};

    if (f.HELPERS) {
        objects.grid = new THREE.GridHelper(100, 100);
        objects.axis = new THREE.AxisHelper(10);
    }

    objects.ambientLight = new THREE.AmbientLight(0x777777);

    let directLight = new THREE.DirectionalLight(0xfcfade, 0.75);
    directLight.position.set(150, 20, 150);
    objects.directLight = directLight;

    let pointLight = new THREE.PointLight(0xadac9f);
    pointLight.position.set(0, 15, -30);
    objects.pointLight = pointLight;

    objects.earth = new Earth();

    return objects;
}

module.exports = {
    createSceneObjects,
};
