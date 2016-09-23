const Model = require('backbone-model').Model;

const INITIALSTATE = {
    frame: 0,
};

function reducer(state = INITIALSTATE, action, attributes) {
    switch (action) {
        case 'CAMERA-MOVED':
            return Object.assign({}, state, {
                position: attributes.position.toArray().map(c => c.toFixed(2)).toString(),
                quaternion: attributes.quaternion.toArray().map(c => c.toFixed(2)).toString(),
                lookAt: attributes.lookAt.toArray().map(c => c.toFixed(2)).toString(),
                target: attributes.target.toArray().map(c => c.toFixed(2)).toString(),
            });

        case 'FRAME-CHANGED':
            return Object.assign({}, state, attributes);

        default:
            return state;
    }
}

let Store = Model.extend({
    initialize: function() {
        this.set(reducer());
    },

    dispatch: function(action, attributes) {
        this.set(reducer(this.attributes, action, attributes));
        console.log(`STORE: ${_.keys(this.changedAttributes())}`);
    },
});

let store = new Store();

module.exports = window.store = store;
