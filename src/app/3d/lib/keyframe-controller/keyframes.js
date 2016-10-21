/* eslint-disable camelcase */

const m = require('math');
const V3 = require('THREE').Vector3;

module.exports = window.keyframes = [
    {
        earth_rotation: new V3(0, -2, 0),
        camera_position: new V3(-3000, 6000, 10000),
        camera_rotation: new V3(m.degree(9), 0, m.degree(19)),
        seattle_opacity: 0,
    }, { /** Focus on Seattle **/
        earth_rotation: new V3(0, 0, 0),
        camera_position: new V3(-3000, 4000, 10000),
        camera_rotation: new V3(m.degree(2), 0, m.degree(19)),
        seattle_opacity: 1,
        ny_opacity: 0,
    }, { /** Focus on New York **/
        camera_position: new V3(4000, 5000, 7000),
        camera_rotation: new V3(m.degree(-10), m.degree(46), 0),
        seattle_opacity: 0,
        ny_opacity: 1,
    }, { /** Flyover of earth **/
        camera_position: new V3(6000, 4400, 4000),
        camera_rotation: new V3(m.degree(0), m.degree(60), 0),
        ny_opacity: 0,
    }, { /** Big title **/
        camera_position: new V3(6500, 4400, 4500),
        camera_rotation: new V3(0, m.degree(22), 0),
    }, { /** Quote **/
        camera_position: new V3(6600, 4420, 4500),
        camera_rotation: new V3(0, m.degree(15), 0),
        karman_opacity: 0,
    }, { /** Karman Line **/
        camera_position: new V3(6600, 4320, 3500),
        camera_rotation: new V3(0, m.degree(15), m.degree(-53)),
        karman_opacity: 1,
    }, { /** Karman Line Zoom In **/
        camera_position: new V3(6600, 4320, 500),
        camera_rotation: new V3(m.degree(-5), m.degree(35), m.degree(-49)),
        karman_opacity: 1,
    }, { /** Fast flyover **/
        camera_position: new V3(4500, 4320, -5500),
        camera_rotation: new V3(m.degree(-45), m.degree(65), m.degree(-30)),
        karman_opacity: 1,
        iss_opacity: 0,
    }, { /** Gravity mention **/
        camera_position: new V3(4500, 10000, -2500),
        camera_rotation: new V3(m.degree(-70), m.degree(10), m.degree(0)),
        // camera_rotation: new V3(m.degree(-90), m.degree(0), m.degree(0)),
        karman_opacity: 0,
        iss_opacity: 1,
    }, { /** ISS Flyover **/
        camera_position: new V3(4500, 11000, -2000),
        camera_rotation: new V3(m.degree(-70), m.degree(10), m.degree(0)),
        karman_opacity: 0,
        iss_opacity: 1,
    }, { /** Top view **/
        camera_position: new V3(0, 50000, 0),
        camera_rotation: new V3(-1.57, 0, 0),
        iss_opacity: 0,
    }, { /** Side view **/
        camera_position: new V3(0, 0, 50000),
        camera_rotation: new V3(0, 0, 0),
    },
];
