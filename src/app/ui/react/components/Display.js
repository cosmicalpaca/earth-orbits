const React = require('react');
const store = require('../../store');

class Display extends React.Component {
    constructor() {
        super();
        this.state = {
            position: '',
            quaternion: '',
            lookAt: '',
        };
    }

    componentDidMount() {
        store.on('change:position', () => this.onCameraPositionChange());
    }

    onCameraPositionChange() {
        this.setState({
            position: store.get('position'),
            quaternion: store.get('quaternion'),
            lookAt: store.get('lookAt'),
        });
    }

    render() {
        return (
            <div className="variables-display">
                <div>pos:</div>
                <div>{this.state.position}</div>
                <div>quaternion:</div>
                <div>{this.state.quaternion}</div>
                <div>look at:</div>
                <div>{this.state.lookAt}</div>
            </div>
        );
    }
}

module.exports = Display;
