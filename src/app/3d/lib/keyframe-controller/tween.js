const _ = require('lodash');
const THREE = require('THREE');
const tweenFunctions = require('tween-functions');

/**
 * Creates a function that approximates value to a given one
 *
 * @param object
 * @param prop
 * @param froms
 * @param to
 * @param length
 * @returns {Function}
 */
function createTweenFunction([object, prop, from, to, length]) {

    return function(currentPosition) {
        if (_.isNumber(from)) {
            let newValue = tweenFunctions.easeInOutQuad(currentPosition, from, to, length);
            _.isFunction(object[prop]) ? object[prop](newValue) : object[prop] = newValue;
        } else {
            let x = tweenFunctions.easeInOutQuad(currentPosition, from.x, to.x, length);
            let y = tweenFunctions.easeInOutQuad(currentPosition, from.y, to.y, length);
            let z = tweenFunctions.easeInOutQuad(currentPosition, from.z, to.z, length);

            switch(prop) {
                case 'position':
                case 'target':
                    object[prop].x = x;
                    object[prop].y = y;
                    object[prop].z = z;
                    break;
                case 'rotation':
                    let rotationVector = new THREE.Vector3(x, y, z);
                    object[prop].setFromVector3(rotationVector);
                    break;
                default:
                    console.warn(`Specify how to handle "${prop}" property`);
            }
        }
    };
}


module.exports = {
    createTweenFunction,
};
