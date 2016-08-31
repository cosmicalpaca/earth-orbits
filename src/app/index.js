const store = require('./store');

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const Stats = require('stats.js');

const Earth = require('./meshes/earth');

/**
 * This file sets up THREE.js and all
 * things that go with it.
 */

class App {
    constructor() {
        this.initializeScene();
        this.initializeStats();
        this.composeScene();
        this.render();
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
        this.camera.position.copy(new THREE.Vector3(0, 0, 10));

        this.controls = new OrbitControls(this.camera);
        this.controls.damping = 2;

        document.body.appendChild(this.renderer.domElement);
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
