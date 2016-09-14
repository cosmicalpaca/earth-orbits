const React = require('react');

class Story extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div>
                <div className="frame">
                    <h1>Things that orbit Earth</h1>
                </div>
                <div className="frame">
                    If you live, for example, in Seattle, space is closer to you then the ocean.
                </div>
            </div>
        );
    }
}

module.exports = Story;
