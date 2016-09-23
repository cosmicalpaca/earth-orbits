const store = require('store');
const _ = require('lodash');
const keyframes = require('./lib/keyframes');
const tweenFunctions = require('tween-functions');

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
            this.onRequestAnimationFrame();

            store.on('change:keyframe', this.setKeyframe.bind(this));
            this.setKeyframe();
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
        this.controls.zoomSpeed = 0.2;
        this.controls.addEventListener('change', () => this.onControlsUpdate());
        this.controls.enabled = false;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') {
                (typeof this.__controls === 'undefined') && (this.__controls = true);
                if (this.__controls) {
                    this.__controls = false;
                    this.controls.enabled = false;
                } else {
                    this.__controls = true;
                    this.controls.enabled = true;
                }
            }
        });

        document.querySelector('.webgl-container').appendChild(this.renderer.domElement);

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
        let position = this.camera.position;
        let lookAt = new THREE.Vector3(0, 0, -1);
        let quaternion = this.camera.quaternion;
        lookAt.applyQuaternion(quaternion);
        let target = this.controls.target;

        store.dispatch('CAMERA-MOVED', {
            position,
            quaternion,
            lookAt,
            target,
        });
    }

    /**
     * This gets run every request animation frame
     */
    onRequestAnimationFrame() {
        this.stats.begin();
        this.draw();
        this.stats.end();
        requestAnimationFrame(this.onRequestAnimationFrame.bind(this));

        this.updateTweens();
    }

    render() {
        /** Actually draws things **/
        this.controls && this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setKeyframe() {
        let keyframe = store.get('keyframe');
        this._tweens = [];

        _.forEach(keyframe.to, (value, path) => {
            let pathSegments = _.split(path, '_');
            let prop = pathSegments.pop();
            let object = this[pathSegments.join('.')];

            this.tweenProperty(object, prop, keyframe.from[path], keyframe.to[path], keyframe.length);
        });
    }

    tweenProperty(object, prop, from, to, length) {
        let fromX = from.x;
        let fromY = from.y;
        let fromZ = from.z;

        let toX = to.x;
        let toY = to.y;
        let toZ = to.z;

        let fn = function(currentPosition) {
            let x = tweenFunctions.easeInOutQuad(currentPosition, fromX, toX, length);
            let y = tweenFunctions.easeInOutQuad(currentPosition, fromY, toY, length);
            let z = tweenFunctions.easeInOutQuad(currentPosition, fromZ, toZ, length);

            object[prop].x = x;
            object[prop].y = y;
            object[prop].z = z;
        }

        this._tweens.push(fn);
    }

    updateTweens() {
        let scroll = document.body.scrollTop;
        let currentFrame = store.get('keyframe');
        let currentPosition = scroll - currentFrame.top;

        _.forEach(this._tweens, fn => {
            fn(currentPosition);
        });
    }
}

window.T = THREE;
window.app = new App();
