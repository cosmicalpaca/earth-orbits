/**
 * Function to set opacity of object and all it's children,
 * taking opacity multiplier into account
 *
 * @param {THREE.Mesh|THREE.Object3D} object - Three.js object, mesh or sprite
 * @param {Number} newValue - New value for opacity
 */
function setOpacity(object, newValue) {
    if (object.children.length) {
        object.children.map(child => setOpacity(child, newValue));
    } else {
        let multiplier = object.material.opacityMultiplier || 1;
        object.material.opacity = newValue * multiplier;
    }
}

module.exports = {
    setOpacity,
};
