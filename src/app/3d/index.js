const store = require('store');
const _ = require('lodash');

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const Stats = require('stats.js');

const Earth = require('./meshes/earth');
const SurfaceLocation = require('./meshes/surface-location');

const TWEEN = require('tween.js');


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

        // this.controls = new OrbitControls(this.camera);
        // this.controls.zoomSpeed = 0.2;
        // this.controls.addEventListener('change', () => this.onControlsUpdate());
        //
        // document.addEventListener('keydown', (e) => {
        //     if (e.key === 'Shift') {
        //         (typeof this.__controls === 'undefined') && (this.__controls = true);
        //         if (this.__controls) {
        //             this.__controls = false;
        //             this.controls.enabled = false;
        //         } else {
        //             this.__controls = true;
        //             this.controls.enabled = true;
        //         }
        //     }
        // });

        document.getElementById('webgl-container').appendChild(this.renderer.domElement);

        document.addEventListener('scroll', _.debounce(this.handleScroll.bind(this), 50));

        this.tween = new TWEEN.Tween(this.camera.position)
            .to({x: 20, y: 20, z: 20}, 1000)
            .onUpdate(function (x, y, z) {
                console.log(this.x, this.y, this.z);
            })
            .start();


        /**
         * USE TWEEN FUNCTIONS FROM HERE:
         * https://www.npmjs.com/package/tween-functions
         *
         * WITH SCROLL POSITION INSTEAD OF TIME ARGUMENT
         */
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
        let quaternion = this.camera.quaternion;
        lookAtVector.applyQuaternion(quaternion);
        store.dispatch('CAMERA-MOVED', {position: positionVector, quaternion: quaternion, lookAt: lookAtVector});
    }

    /**
     * This gets run every request animation frame
     */
    render() {
        this.stats.begin();
        this.drawFrame();
        this.stats.end();
        requestAnimationFrame(this.render.bind(this));
        TWEEN.update(document.body.scrollTop * 10);
    }

    /**
     * This actually draws things every frame
     */
    drawFrame() {
        this.controls && this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    handleScroll(e) {
        let scroll = document.body.scrollTop;
        this.scroll = scroll;
    }
}

let app = window.app = new App();
