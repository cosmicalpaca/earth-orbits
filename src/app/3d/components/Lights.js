const React = require('react');
const THREE = require('three');

class Lights extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.directionalLightPosition = new THREE.Vector3(15000, 20000, 15000);

        this.color = new THREE.Color(0xfcfade);
    }

    render() {
        return (
            <group>
                <ambientLight color={0x777777}/>
                <directionalLight
                    name="sun"
                    color={0xfcfade}
                    intensity={0.85}
                    position={this.directionalLightPosition}
                />
            </group>
        )
    }
}

module.exports = Lights;
