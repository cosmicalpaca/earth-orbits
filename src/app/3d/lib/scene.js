const THREE = require('three');
const f = require('flags');

const Earth = require('./meshes/earth');
const Karman = require('./meshes/karman');
const ISS = require('./meshes/iss');

module.exports = function() {
    let objects = [];

    if (f.HELPERS) {
        objects.push(new THREE.GridHelper(100, 100));
        objects.push(new THREE.AxisHelper(10));
    }

    objects.push(new THREE.AmbientLight(0x777777));

    let directLight = new THREE.DirectionalLight(0xfcfade, 0.75);
    directLight.position.set(150000, 20000, 150000);
    directLight.name = 'sun';
    objects.push(directLight);

    objects.push(new Earth().mesh);

    objects.push(new Karman().mesh);

    objects.push(new ISS().mesh);
    
    return objects;
};
