const React = require('react');
const Display = require('./components/Display');
const Story = require('./components/Story');

let UI = React.createClass({
    render: function() {
        return (
            <div>
                <Display/>
            </div>
        );
    },
});

// export default UI;
module.exports = UI;
