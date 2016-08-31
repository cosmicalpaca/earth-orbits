const Model = require('backbone-model').Model;

var Store = Model.extend({
    initialize: function() {

    },

    dispatch: function(action, attributes) {
        switch (action) {
            case 'CAMERA-MOVED':
                this.set({
                    position: attributes.position.toArray().toString(),
                    lookAt: attributes.lookAt.toArray().toString(),
                });
                break;
            default:
                throw new Error('Action dispatched on the store does not have a handler');
        }
    },
});

var store = new Store();

module.exports = store;
