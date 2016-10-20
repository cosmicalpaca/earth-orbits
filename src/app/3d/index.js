const _ = require('lodash');
const store = require('store');
const THREE = require('three');

const createScene = require('./lib/scene');
const stats = require('./lib/stats');
const lca = require('./lib/lca');
const f = require('flags');

const KC = require('./lib/keyframe-controller');
const tween = require('./lib/keyframe-controller/tween');

/**
 * TODO: Color correction as in http://i.stack.imgur.com/pp9zr.jpg
 *
 * TODO: Webworker for tween calculations. Batch tween application in one operation.
 *
 * TODO: Refactor to use object names to find objects to tween
 *
 * TODO: Add vignette filter
 *
 * TODO: Remove from scene when not in use
 */

class App {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.dynamicObjects = [];
        this.tweens = [];

        this.addEventListeners();

        [this.renderer, this.camera] = lca.initialize();

        this.scene = new THREE.Scene();
        _.forEach(createScene(), object => {
            this.scene.add(object);

            if (object.update) {
                this.dynamicObjects.push(object.name);
            }
        });

        this.stats = stats.initialize();

        this.kc = new KC();

        this.handleRequestAnimationFrame();
    }

    addEventListeners() {
        store.on('change:keyframe', this.handleKeyframeChange.bind(this));
        store.on('change:controls', () => {
            this.controls = store.get('controls');
            this.tweens = [];
        });
    }

    handleRequestAnimationFrame() {
        this.stats.begin();
        this.render();
        this.updateFixedRelations();
        this.updateCurrentAnimations();
        this.broadcastMetrics();
        this.updateDynamicObjects();
        this.stats.end();

        requestAnimationFrame(this.handleRequestAnimationFrame.bind(this));
    }

    render() {
        this.controls && this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    broadcastMetrics() {
        store.dispatch('CAMERA-MOVED', {
            position: this.camera.position,
            rotation: this.camera.rotation.toVector3(),
        });
    }

    updateDynamicObjects() {
        if (this.dynamicObjects.length) {
            this.dynamicObjects.map(name => {
                this.scene.getObjectByName(name).update();
            });
        }
    }

    handleKeyframeChange(store, keyframe) {
        this.tweens = [];
        this.__keyframe = keyframe;

        let propsForBothFrames = _.intersection(_.keys(keyframe.from), _.keys(keyframe.to));

        this.tweens = propsForBothFrames.map(propString => {
            if (this.controls && propString.includes('camera')) return _.noop;

            let pathSegments = _.split(propString, '_');
            let objectName = pathSegments[0];
            let objectProp = pathSegments[1];

            let object = this.lookUpObjectByName(objectName);

            if (!object) throw new Error(`Object not found: ${objectName} [${objectProp}]`);

            return tween.createTweenFunction(object, objectProp, keyframe.from[propString], keyframe.to[propString], keyframe.length, keyframe.easing);
        });
    }

    lookUpObjectByName(name) {
        switch (name) {
            case 'camera': return this.camera;
            default: return this.scene.getObjectByName(name);
        }
    }

    updateCurrentAnimations() {
        if (!this.tweens) return;

        let scroll = document.body.scrollTop;
        let positionInKeyframe = scroll - this.__keyframe.top;

        _.forEach(this.tweens, fn => fn(positionInKeyframe));
    }

    updateFixedRelations() {
        if (f.shaders) {
            this.glowVector || (this.glowVector = new THREE.Vector3(0, 0, 0));
            this.glowVector.copy(this.camera.position).multiplyScalar(-0.5);
            this.scene.getObjectByName('glow').material.uniforms.viewVector.value = this.glowVector;
        }
    }
}

window.T = window.THREE = THREE;
window.app = new App();
