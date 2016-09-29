const Stats = require('stats.js');

function initialize() {
    let stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    return stats;
}

module.exports = {
    initialize,
};
