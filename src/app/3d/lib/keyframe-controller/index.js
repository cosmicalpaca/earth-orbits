const invariant = require('invariant');
const _ = require('lodash');
const store = require('store');

const KEYFRAMES = require('./keyframes');

/**
 * Dispatches an event when new keyframe comes into view
 */
class KeyframeController {
    constructor() {
        this.buildKeyframesHash();
        this.__currentKeyframeIndex = null;

        document.addEventListener('scroll', _.debounce(this.handleScroll.bind(this), 10));
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
                easing: frame.dataset.easing || 'easeInOutQuad',
                index: index,
            };
        });

        if (frameElements.length !== KEYFRAMES.length)
            console.warn(`DOM frames count (${frameElements.length}) is different from Keyframe count (${KEYFRAMES.length})`);
    }

    getKeyframeInView(scroll) {
        let keyframe = _.find(this._keyframes, frame => (scroll >= frame.top && scroll < frame.bottom));
        invariant(keyframe, `Can't find frame for scroll ${scroll}`);
        return keyframe;
    }

    handleScroll() {
        let scroll = document.body.scrollTop;
        let keyframe = this.getKeyframeInView(scroll);

        if (this.__currentKeyframeIndex !== keyframe.index) {
            this.__currentKeyframeIndex = keyframe.index;
            store.dispatch('FRAME-CHANGED', {
                keyframe,
            });
        }
    }
}

module.exports = KeyframeController;
