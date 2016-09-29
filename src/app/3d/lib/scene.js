const THREE = require('three');
const Earth = require('./meshes/earth');

function createSceneObjects() {
    let objects = {};

    objects.grid = new THREE.GridHelper(100, 100);
    objects.axis = new THREE.AxisHelper(10);
    objects.ambientLight = new THREE.AmbientLight(0x333333);

    let directLight = new THREE.DirectionalLight(0xffffff, 1);
    directLight.position.set(5, 3, 5);
    objects.directLight = directLight;

    objects.earth = new Earth().mesh;

    return objects;
}

module.exports = {
    createSceneObjects,
};
