const React = require('react');
const store = require('../../store');

let Display = React.createClass({
    getInitialState() {
        return {
            position: '',
            lookAt: '',
        };
    },

    componentDidMount: function() {
        store.on('change:position', () => this.onCameraPositionChange());
    },

    onCameraPositionChange: function() {
        this.setState({
            position: store.get('position'),
            lookAt: store.get('lookAt'),
        });
    },

    render: function() {
        return (
            <div>
                <div>pos:</div>
                <div>{this.state.position}</div>
                <div>look at:</div>
                <div>{this.state.lookAt}</div>
            </div>
        );
    },
});

module.exports = Display;
