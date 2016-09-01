const Model = require('backbone-model').Model;

var Store = Model.extend({
    dispatch: function(action, attributes) {
        switch (action) {
            case 'CAMERA-MOVED':
                this.set({
                    position: attributes.position.toArray().map(c => c.toFixed(2)).toString(),
                    lookAt: attributes.lookAt.toArray().map(c => c.toFixed(2)).toString(),
                });
                break;
            default:
                throw new Error('Action dispatched on the store does not have a handler');
        }
    },
});

var store = new Store();

module.exports = store;
