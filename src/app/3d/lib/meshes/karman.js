const THREE = require('THREE');
const m = require('math');
const c = require('constants');
const h = require('helpers');

const Orbital = require('./orbital');

class Karman {
    constructor() {
        let group = new THREE.Object3D();

        let karmanline = (new Orbital.Line(c.karmanLine)).mesh;
        karmanline.rotateY(m.degree(25));
        group.add(karmanline);

        let karmanband = (new Orbital.Band(c.earthRadius, c.karmanLine)).mesh;
        karmanband.material.opacityMultiplier = 0.25;
        karmanband.rotateY(m.degree(25));
        group.add(karmanband);
        
        let karmanmeasurement = (new Orbital.Measurement(c.earthRadius, c.karmanLine, '100km')).mesh;
        karmanmeasurement.rotateZ(m.degree(40));
        karmanmeasurement.rotateY(m.degree(19.5));
        group.add(karmanmeasurement);

        group.name = 'karman';
        h.setOpacity(group, 0);

        this.mesh = group;
    }
}

module.exports = Karman;
