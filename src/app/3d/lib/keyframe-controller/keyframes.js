/* eslint-disable camelcase */

const m = require('math');
const V3 = require('THREE').Vector3;

module.exports = window.keyframes = [
    {
        earth_rotation: new V3(0, -2, 0),
        camera_position: new V3(-3, 6, 10),
        camera_rotation: new V3(m.degree(9), 0, m.degree(19)),
        earth_seattle_opacity: 0,
    }, { /** Focus on Seattle **/
        earth_rotation: new V3(0, 0, 0),
        camera_position: new V3(-3, 4, 10),
        camera_rotation: new V3(m.degree(2), 0, m.degree(19)),
        earth_seattle_opacity: 1,
        earth_ny_opacity: 0,
    }, { /** Focus on New York **/
        camera_position: new V3(5.5, 4.4, 8.5),
        camera_rotation: new V3(m.degree(-10), m.degree(48), 0),
        earth_seattle_opacity: 0,
        earth_ny_opacity: 1,
    }, {
        camera_position: new V3(0, -20, 40),
        camera_rotation: new V3(0.5, 0.5, 0.5),
        earth_ny_opacity: 0,
    }, {
        camera_position: new V3(10, -30, 50),
        camera_rotation: new V3(-20, 20, 0),
    }, {
        camera_position: new V3(10, -30, 50),
        camera_rotation: new V3(20, 20, 0),
    }, {
        camera_position: new V3(10, -30, 50),
        camera_rotation: new V3(20, 20, 0),
    },
];
