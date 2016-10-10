const Model = require('backbone-model').Model;

const INITIALSTATE = {
    frame: 0,
};

let Store = Model.extend({
    initialize: function() {
        this.set(this.reducer());
    },

    dispatch: function(action, attributes) {
        this.set(this.reducer(this.attributes, action, attributes));
    },

    reducer: function(state = INITIALSTATE, action, attributes) {
        switch (action) {
            case 'CAMERA-MOVED':
                return Object.assign({}, state, {
                    position: attributes.position.toArray().map(c => c.toFixed(2)).toString(),
                    rotation: attributes.rotation.toArray().map(c => c.toFixed(2)).toString(),
                });

            case 'CONTROLS-ENABLED':
                return Object.assign({}, state, attributes);

            case 'FRAME-CHANGED':
                return Object.assign({}, state, attributes);

            case 'SET-ANISOTROPY':
                return Object.assign({}, state, attributes);

            default:
                return state;
        }
    },
});

let store = new Store();

module.exports = window.store = store;
