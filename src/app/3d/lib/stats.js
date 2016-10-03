const Stats = require('stats.js');

function initialize() {
    let stats = new Stats();
    stats.showPanel(2);
    document.body.appendChild(stats.dom);
    return stats;
}

module.exports = {
    initialize,
};
