const store = require('./store');

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const Stats = require('stats.js');

const Earth = require('./meshes/earth');
const SurfaceLocation = require('./meshes/surface-location');

const ReactDom = require('react-dom');

const React = require('react'); // eslint-disable-line no-unused-vars
const UI = require('./ui'); // eslint-disable-line no-unused-vars

/**
 * This file is used to set up things
 */

ReactDom.render(<UI/>, document.getElementById('react-container'));


class App {
    constructor() {
        this.loadFonts();
    }

    /**
     * Load fonts first
     */
    loadFonts() {
        let fontLoader = new THREE.FontLoader();
        fontLoader.load('fonts/droid_serif_bold.typeface.json', (response) => {
            this.font = response;

            this.initializeScene();
            this.initializeStats();
            this.composeScene();
            this.render();
        });
    }

    /**
     * Prepare basics: rendeder, camera and scene
     */
    initializeScene() {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({antialias: false});
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.position.copy(new THREE.Vector3(0, 0, 20));

        this.controls = new OrbitControls(this.camera);
        this.controls.damping = 2;
        this.controls.addEventListener('change', () => this.onControlsUpdate());

        webGLContainer.appendChild(this.renderer.domElement);
    }

    /**
     * Set up Stats widget for FPS count
     */
    initializeStats() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    /**
     * Add objects to the scene
     */
    composeScene() {
        this.ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(this.ambientLight);

        this.directLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directLight.position.set(5, 3, 5);
        this.scene.add(this.directLight);

        this.earth = new Earth();
        this.scene.add(this.earth.planet, this.earth.clouds);

        let seattle = new SurfaceLocation(47.60, 122.33);
        this.scene.add(seattle);
    }

    /**
     * When camera is moved, we log the position and rotation
     */
    onControlsUpdate() {
        let positionVector = this.camera.position;
        let lookAtVector = new THREE.Vector3(0, 0, -1);
        lookAtVector.applyQuaternion(this.camera.quaternion);
        store.dispatch('CAMERA-MOVED', {position: positionVector, lookAt: lookAtVector});
    }

    /**
     * This gets run every request animation frame
     */
    render() {
        this.stats.begin();
        this.drawFrame();
        this.stats.end();
        requestAnimationFrame(this.render.bind(this));
    }

    /**
     * This actually draws things every frame
     */
    drawFrame() {
        this.controls && this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

new App();
