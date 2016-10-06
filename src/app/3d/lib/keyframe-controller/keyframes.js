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
        camera_position: new V3(4, 4.7, 7),
        camera_rotation: new V3(m.degree(-10), m.degree(48), 0),
        earth_seattle_opacity: 0,
        earth_ny_opacity: 1,
    }, { /** Flyover of earth **/
        camera_position: new V3(9, 4.4, 3.0),
        camera_rotation: new V3(m.degree(0), m.degree(70), 0),
        earth_ny_opacity: 0,
    }, { /** Big title **/
        camera_position: new V3(8.5, 3.5, 5),
        camera_rotation: new V3(-0.7, 1.75, 0),
    }, {
        camera_position: new V3(0, 50, 0),
        camera_rotation: new V3(-1.57, 0, 0),
    }, {
        camera_position: new V3(0, 0, 50),
        camera_rotation: new V3(0, 0, 0),
    },
];
