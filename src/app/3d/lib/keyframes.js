/* eslint-disable camelcase */

const invariant = require('invariant');
const _ = require('lodash');
const V3 = require('THREE').Vector3;
const store = require('store');

let KEYFRAMES = [
    {
        camera_position: new V3(0, 0, 20),
        controls_target: new V3(0, 0, 0),
    }, {
        camera_position: new V3(0, -20, 40),
        controls_target: new V3(20, 20, 0)
    }, {
        camera_position: new V3(10, -30, 50),
        controls_target: new V3(20, 20, 0)
    }
];

class KeyframeController {
    constructor() {
        this.buildKeyframesHash();
        document.addEventListener('scroll', _.debounce(this.handleScroll.bind(this), 10));
        this._currentKeyframeIndex = null;
        this.handleScroll();
    }

    buildKeyframesHash() {
        let frameElements = document.querySelectorAll('.frame');

        this._keyframes = _.map(frameElements, (frame, index) => {
            return {
                top: frame.offsetTop,
                bottom: frame.offsetTop + frame.offsetHeight,
                length: frame.offsetHeight,
                from: KEYFRAMES[index],
                to: KEYFRAMES[index + 1],
                index: index,
            };
        });
    }

    getKeyframeInView(scroll) {
        let keyframe = _.find(this._keyframes, frame => (scroll >= frame.top && scroll < frame.bottom));
        invariant(keyframe, `Can't find frame for scroll ${scroll}`);
        return keyframe;
    }

    handleScroll() {
        let scroll = document.body.scrollTop;
        let keyframe = this.getKeyframeInView(scroll);

        if (this._currentKeyframeIndex !== keyframe.index) {
            this._currentKeyframeIndex = keyframe.index;
            store.dispatch('FRAME-CHANGED', {
                keyframe
            });
        }
    }
}

let instance = window.keyframeController = new KeyframeController();

module.exports = window.keyframes = KEYFRAMES;
