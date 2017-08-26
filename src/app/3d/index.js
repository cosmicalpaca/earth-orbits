const _ = require('lodash');
const store = require('store');
const THREE = require('three');
const React = require('react');
const React3 = require('react-three-renderer');
const ReactDOM = require('react-dom');
const OrbitControls = require('three-orbit-controls')(THREE);
const KC = require('./lib/keyframe-controller');
const tween = require('./lib/keyframe-controller/tween');


const f = require('flags');
const m = require('math');

/**
 * TODO: Color correction as in http://i.stack.imgur.com/pp9zr.jpg
 * TODO: Webworker for tween calculations. Batch tween application in one operation.
 * TODO: Refactor to use object names to find objects to tween
 * TODO: Add vignette filter
 * TODO: Remove from scene when not in use
 * TODO: Add absolute max-width to body!
 */

// window.T = window.THREE = THREE;
// window.app = new App();


const Helpers = require('./components/Helpers');
const Lights = require('./components/Lights');
const Earth = require('./components/Earth');

class App extends React.Component{
    constructor(props, context) {
        super(props, context);

        this.state = {
            cubeRotation: new THREE.Euler(),
            cameraPosition: new THREE.Vector3(0, 0, 10000),
            cameraRotation: new THREE.Euler(),
        };

        new KC();

        store.on('change:keyframe', this.handleKeyframeChange.bind(this));
        this.tweens = [];

        this.handleKeyframeChange()
    }

    onAnimate() {
        let state = Object.assign({}, this.state, this.getStateForCurrentAnimation());
        this.setState(state);
        // this.controls.update();
    }

    componentDidMount() {
        // this.controls = new OrbitControls(this.refs.camera);
        // this.controls.zoomSpeed = 0.2;
        // this.controls.addEventListener('change', () => this.onControlsChange())
    }

    onControlsChange() {
        this.setState({
            cameraPosition: this.refs.camera.position.clone(),
            cameraRotation: this.refs.camera.rotation.clone(),
        })
    }

    getStateForCurrentAnimation() {
        if (!this.tweens) return;

        let scroll = document.body.scrollTop;
        let positionInKeyframe = scroll - this.__keyframe.top;

        let newState = {};

        _.forEach(this.tweens, (fn, propString) => {
            newState[propString] = fn(positionInKeyframe);
        });

        return newState;
    }

    handleKeyframeChange() {
        let keyframe = store.get('keyframe');

        this.tweens = [];
        this.__keyframe = keyframe;

        let propsForBothFrames = _.intersection(_.keys(keyframe.from), _.keys(keyframe.to));

        this.tweens = _.transform(propsForBothFrames, (result, propString) => {
            if (this.controls && propString.includes('camera')) return _.noop;
            result[propString] = tween(keyframe.from[propString], keyframe.to[propString], keyframe.length, keyframe.easing);
        }, {});
    }


    render() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        let cameraPosition = this.state.camera_position;
        let cameraRotation = this.state.camera_rotation;

        return (
            <React3
                mainCamera="camera"
                width={width}
                height={height}
                onAnimate={() => this.onAnimate()}
            >
                <resources>
                    <texture resourceId="earthmap" url="images/map_4k.jpg"/>

                    <meshPhongMaterial resourceId="earthmaterial">
                        <textureResource resourceId="earthmap"/>
                    </meshPhongMaterial>
                </resources>

                <scene>
                    <perspectiveCamera
                        name="camera"
                        ref="camera"
                        fov={75}
                        aspect={width / height}
                        near={0.1}
                        far={100000}
                        position={cameraPosition}
                        rotation={cameraRotation}
                    />
                    <Lights/>
                    <Helpers/>

                    <Earth state={this.state.earth}/>
                </scene>
            </React3>
        )
    }
}



ReactDOM.render(<App/>, document.getElementById('webgl-container'));
