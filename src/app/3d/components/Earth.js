const React = require('react');
const THREE = require('three');
const c = require('constants');
const f = require('flags');
const m = require('math');

const SEGMENTS = 64;

/**
 * FORK REACT3 and add bump map support in
 * https://github.com/toxicFork/react-three-renderer/blob/master/src/lib/descriptors/Material/TextureDescriptor.js#L177
 *
 * <materialResource resourceId="earthmaterial"/>
 **/


class Earth extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.radius = c.earthRadius;
    }

    componentDidMount() {
        let seattle = m.latlongToCartesian(47.60, 122.33);
        this.refs.seattle.geometry.translate(seattle.x, seattle.y, seattle.z + 20);

        let ny = m.latlongToCartesian(43.36, 72);
        this.refs.ny.geometry.translate(ny.x, ny.y, ny.z + 20);
    }

    render() {
        return (
            <group name="earth">
                <mesh>
                    <sphereGeometry
                        widthSegments={SEGMENTS}
                        heightSegments={SEGMENTS}
                        radius={this.radius}
                    />

                    <meshPhongMaterial
                        specular={new THREE.Color('grey')}
                    >
                        <texture url="images/map_4k.jpg" slot={"map"}/>
                        <texture url="images/bump_4k.jpg" slot={"bumpMap"}/>
                        <texture url="images/spec_4k.png" slot={"specularMap"}/>
                    </meshPhongMaterial>
                </mesh>

                <mesh ref="seattle">
                    <sphereGeometry
                        radius={10}
                        widthSegments={6}
                        heightSegments={6}
                    />

                    <meshBasicMaterial
                        transparent={true}
                        depthTest={false}
                    />
                </mesh>

                <mesh ref="ny">
                    <sphereGeometry
                        radius={10}
                        widthSegments={6}
                        heightSegments={6}
                    />

                    <meshBasicMaterial
                        transparent={true}
                        depthTest={false}
                    />
                </mesh>
            </group>
        )
    }
}

module.exports = Earth;
