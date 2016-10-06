const _ = require('lodash');
const store = require('store');
const THREE = require('three');

const scene = require('./lib/scene');
const stats = require('./lib/stats');
const lca = require('./lib/lca');
const f = require('flags');

const KC = require('./lib/keyframe-controller');
const tween = require('./lib/keyframe-controller/tween');

/**
 * TODO: Color correction as in http://i.stack.imgur.com/pp9zr.jpg
 *
 * TODO: Webworker for tween calculations. Batch tween application in one operation.
 */

class App {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.addEventListeners();

        [this.renderer, this.camera] = lca.initialize();

        this.scene = new THREE.Scene();
        _.forEach(scene.createSceneObjects(), (object, name) => {
            this.scene.add(object);
            this[name] = object;
        });

        this.stats = stats.initialize();

        this.kc = new KC();

        this.handleRequestAnimationFrame();
    }

    addEventListeners() {
        store.on('change:keyframe', this.handleKeyframeChange.bind(this));
    }

    handleRequestAnimationFrame() {
        this.stats.begin();
        this.render();
        this.updateFixedRelations();
        this.updateCurrentAnimations();
        this.broadcastMetrics();
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

    handleKeyframeChange(store, keyframe) {
        this.tweens = [];
        this.__keyframe = keyframe;

        let propsForBothFrames = _.intersection(_.keys(keyframe.from), _.keys(keyframe.to));

        this.tweens = propsForBothFrames.map(propString => {
            let pathSegments = _.split(propString, '_');
            let prop = pathSegments.pop();
            let object = _.get(this, `${pathSegments.join('.')}`);

            if (!object) throw new Error(`Bad object specified for tween`);

            return tween.createTweenFunction(object, prop, keyframe.from[propString], keyframe.to[propString], keyframe.length, keyframe.easing);
        });
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
