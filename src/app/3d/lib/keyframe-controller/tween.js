const _ = require('lodash');
const THREE = require('THREE');
const tweenFunctions = require('tween-functions');
const h = require('helpers');

/**
 * Creates a function that approximates value to a given one
 *
 * @param object
 * @param prop
 * @param from
 * @param to
 * @param length
 * @param easingFn
 * @returns {Function}
 */
function createTweenFunction(object, propName, from, to, length, easingFn) {
    return function(currentPosition) {

        if (_.isNumber(from)) {
            let newValue = tweenFunctions[easingFn](currentPosition, from, to, length);

            switch (propName) {
                case 'opacity':
                    h.setOpacity(object, newValue);
                    return;
            }
        } else {
            let x = tweenFunctions[easingFn](currentPosition, from.x, to.x, length);
            let y = tweenFunctions[easingFn](currentPosition, from.y, to.y, length);
            let z = tweenFunctions[easingFn](currentPosition, from.z, to.z, length);

            switch (propName) {
                case 'position':
                case 'target':
                    object[propName].x = x;
                    object[propName].y = y;
                    object[propName].z = z;
                    return;

                case 'rotation':
                    let rotationVector = new THREE.Vector3(x, y, z);
                    object[propName].setFromVector3(rotationVector);
                    return;
            }
        }
        console.warn(`Specify how to handle "${propName}" property`);
    };
}

module.exports = {
    createTweenFunction,
};
