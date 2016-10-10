const THREE = require('three');
const store = require('store');
const f = require('flags');
const OrbitControls = require('three-orbit-controls')(THREE);

/** Light Camera Action **/

const CONTROLS_KILLSWITCH = false;

function initialize() {

    /** Renderer **/
    let renderer = new THREE.WebGLRenderer({
        antialias: f.AA,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    store.dispatch('SET-ANISOTROPY', {maxAnisotropy: renderer.getMaxAnisotropy()});
    console.info(`Anisotropy max is set to ${renderer.getMaxAnisotropy()}`)
    document.querySelector('.webgl-container').appendChild(renderer.domElement);

    /** Camera **/
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.position.copy(new THREE.Vector3(0, 0, 20));

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    if (!CONTROLS_KILLSWITCH) {
        document.addEventListener('keydown', e => {
            if (e.key === 'Shift') {
                let controls = new OrbitControls(camera);
                controls.zoomSpeed = 0.2;
                store.dispatch('CONTROLS-ENABLED', {controls});
            }
        });
    }

    return [renderer, camera];
}

module.exports = {
    initialize,
};
