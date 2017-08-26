const React = require('react');
const f = require('flags');

module.exports = class extends React.Component{
    render() {
        if (f.HELPERS) {
            return (
                <group>
                    <gridHelper size={100}/>
                    <axisHelper size={10}/>
                </group>
            )
        } else {
            return null;
        }
    }
};
