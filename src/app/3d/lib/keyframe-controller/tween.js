const _ = require('lodash');
const THREE = require('THREE');
const tweenFunctions = require('tween-functions');

/**
 * Creates a function that approximates value to a given one
 */
module.exports = function createTweenFunction(from, to, length, easingFn) {
    return function(currentPosition) {
        if (_.isNumber(from)) {
            let newValue = tweenFunctions[easingFn](currentPosition, from, to, length);
            return newValue;
        } else {
            let x = tweenFunctions[easingFn](currentPosition, from.x, to.x, length);
            let y = tweenFunctions[easingFn](currentPosition, from.y, to.y, length);
            let z = tweenFunctions[easingFn](currentPosition, from.z, to.z, length);
            return new THREE.Vector3(x, y, z);
        }
    };
}
