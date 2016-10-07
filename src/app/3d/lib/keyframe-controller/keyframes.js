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
        camera_position: new V3(4, 5.0, 7),
        camera_rotation: new V3(m.degree(-10), m.degree(46), 0),
        earth_seattle_opacity: 0,
        earth_ny_opacity: 1,
    }, { /** Flyover of earth **/
        camera_position: new V3(6, 4.4, 4.0),
        camera_rotation: new V3(m.degree(0), m.degree(60), 0),
        earth_ny_opacity: 0,
    }, { /** Big title **/
        camera_position: new V3(6.5, 4.4, 4.5),
        camera_rotation: new V3(0, m.degree(20), 0),
    }, { /** Quote **/
        camera_position: new V3(6.6, 4.42, 4.5),
        camera_rotation: new V3(0, m.degree(15), 0),
        karman_opacity: 0,
    }, { /** Karman Line **/
        camera_position: new V3(6.6, 4.32, 3.5),
        camera_rotation: new V3(0, m.degree(15), m.degree(-53)),
        karman_opacity: 1,
    }, { /** Karman Line Zoom In **/
        camera_position: new V3(6.6, 4.32, 0.5),
        camera_rotation: new V3(m.degree(-5), m.degree(35), m.degree(-49)),
        karman_opacity: 1,
    }, { /** Fast flyover 1 **/
        camera_position: new V3(4.5, 4.32, -5.5),
        camera_rotation: new V3(m.degree(-45), m.degree(65), m.degree(-30)),
        karman_opacity: 1,
    }, { /** Fast flyover 2 **/
        camera_position: new V3(4.5, 4.32, -5.5),
        camera_rotation: new V3(m.degree(-45), m.degree(85), m.degree(-30)),
    }, { /** Top view **/
        camera_position: new V3(0, 50, 0),
        camera_rotation: new V3(-1.57, 0, 0),
        karman_opacity: 1,
    }, { /** Side view **/
        camera_position: new V3(0, 0, 50),
        camera_rotation: new V3(0, 0, 0),
        karman_opacity: 1,
    },
];
