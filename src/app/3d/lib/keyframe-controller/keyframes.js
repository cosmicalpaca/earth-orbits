/* eslint-disable camelcase */

const V3 = require('THREE').Vector3;

module.exports = window.keyframes = [
    {
        earth_rotation: new V3(0, 0, 0),
    },
    {
        earth_rotation: new V3(0, 0.5, 0),
        camera_position: new V3(0, 0, 20),
        controls_target: new V3(0, 0, 0),
    }, {
        camera_position: new V3(0, -20, 40),
        controls_target: new V3(20, 20, 0)
    }, {
        camera_position: new V3(10, -30, 50),
        controls_target: new V3(20, 20, 0)
    }, {
        camera_position: new V3(10, -30, 50),
        controls_target: new V3(20, 20, 0)
    }, {
        camera_position: new V3(10, -30, 50),
        controls_target: new V3(20, 20, 0)
    }, {
        camera_position: new V3(10, -30, 50),
        controls_target: new V3(20, 20, 0)
    }
];
