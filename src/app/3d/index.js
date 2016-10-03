const _ = require('lodash');
const store = require('store');
const THREE = require('three');

const fonts = require('./lib/fonts');
const scene = require('./lib/scene');
const stats = require('./lib/stats');
const lca = require('./lib/lca');

const KC = require('./lib/keyframe-controller');
const tween = require('./lib/keyframe-controller/tween');

class App {
    constructor() {
        this.loadResources()
            .then(() => this.initialize());
    }

    loadResources() {
        return fonts.loadFont();
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
        this.updateCurrentAnimations();
        this.stats.end();

        requestAnimationFrame(this.handleRequestAnimationFrame.bind(this));
    }

    render() {
        this.controls && this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    handleKeyframeChange(store, keyframe) {
        this.tweens = [];
        this.__keyframe = keyframe;

        let propsForBothFrames = _.intersection(_.keys(keyframe.from), _.keys(keyframe.to));

        this.tweens = propsForBothFrames.map(propString => {
            let pathSegments = _.split(propString, '_');
            let prop = pathSegments.pop();
            let object = _.get(this, `${pathSegments.join('.')}`);

            return tween.createTweenFunction(object, prop, keyframe.from[propString], keyframe.to[propString], keyframe.length);
        });
    }

    updateCurrentAnimations() {
        if (!this.tweens) return;

        let scroll = document.body.scrollTop;
        let positionInKeyframe = scroll - this.__keyframe.top;

        _.forEach(this.tweens, fn => fn(positionInKeyframe));
    }
}

window.T = window.THREE = THREE;
window.app = new App();
