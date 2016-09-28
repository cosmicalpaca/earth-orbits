const store = require('store');
const _ = require('lodash');
const keyframes = require('./lib/keyframes');
const tweenFunctions = require('tween-functions');

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const Stats = require('stats.js');

const Earth = require('./meshes/earth');

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

            store.on('change:keyframe', this.setKeyframe.bind(this));
            this.setKeyframe();

            this.onRequestAnimationFrame();
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

        let grid = new THREE.GridHelper(100, 100);
        this.scene.add(grid);

        let axis = new THREE.AxisHelper(10);
        this.scene.add(axis);

        document.querySelector('.webgl-container').appendChild(this.renderer.domElement);
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

        this.earth = new Earth().mesh;
        this.scene.add(this.earth);
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
        this.render();
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

        let fromProps = _.keys(keyframe.from);
        let toProps = _.keys(keyframe.to);

        let propsForBothFrames = _.intersection(fromProps, toProps);

        _.forEach(propsForBothFrames, propString => {
            let pathSegments = _.split(propString, '_');
            let prop = pathSegments.pop();
            let object = _.get(this, `${pathSegments.join('.')}`);

            this.tweenProperty(object, prop, keyframe.from[propString], keyframe.to[propString], keyframe.length);
        });
    }

    tweenProperty(object, prop, from, to, length) {
        let fromValue = from;
        let toValue = to;

        let fn = function(currentPosition) {
            if (_.isNumber(from)) {
                let newValue = tweenFunctions.easeInOutQuad(currentPosition, fromValue, toValue, length);
                _.isFunction(object[prop]) ? object[prop](newValue) : object[prop] = newValue;
            } else {
                let x = tweenFunctions.easeInOutQuad(currentPosition, fromValue.x, toValue.x, length);
                let y = tweenFunctions.easeInOutQuad(currentPosition, fromValue.y, toValue.y, length);
                let z = tweenFunctions.easeInOutQuad(currentPosition, fromValue.z, toValue.z, length);

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

window.T = window.THREE = THREE;
window.app = new App();
