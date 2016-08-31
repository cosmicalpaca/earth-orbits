const c = require('./constants');
const THREE = require('three');

let math = {};

/**
 * Convert Lat/Long coordinates to cartesian coordinates,
 * with Earth's radius as default radius value
 *
 * @param lat, in degrees
 * @param long, in degrees
 * @param radius
 * @returns {*|Vector3}
 */
math.latlongToCartesian = function (lat, long, radius = c.earthRadius) {
    lat = lat * Math.PI / 180;
    long = long * Math.PI / 180;

    return new THREE.Vector3(
        radius * Math.sin(lat) * Math.cos(long),
        radius * Math.sin(lat) * Math.sin(long),
        radius * Math.cos(lat));
};

module.exports = math;
