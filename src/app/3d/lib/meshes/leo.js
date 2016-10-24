const THREE = require('three');
const Orbital = require('./orbital');
const c = require('constants');
const h = require('helpers');

class LEO {
    constructor() {
        let group = new THREE.Group();

        group.add(this._makeBand());
        group.add(this._makeUpperRing());
        group.add(this._makeLowerRing());

        group.name = 'leo';

        h.setOpacity(group, 0);

        this.mesh = group;
    }

    _makeBand() {
        let mesh = new Orbital.Band(c.leoLower, c.leoUpper, 0xdcb6f9).mesh;
        mesh.material.opacity = 0;
        mesh.material.opacityMultiplier = 0.25;
        return mesh;
    }

    _makeUpperRing() {
        let mesh = new Orbital.Line(c.leoUpper, 50, 0x8008db).mesh;
        mesh.material.opacity = 0;
        return mesh;
    }

    _makeLowerRing() {
        let mesh = new Orbital.Line(c.leoLower + 50, 50, 0x8008db).mesh;
        mesh.material.opacity = 0;
        return mesh;
    }
}

module.exports = LEO;
