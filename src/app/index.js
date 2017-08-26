// const React = require('react');
// const ReactDom = require('react-dom');
// const UI = require('./ui');

require('./3d');
// require('./ui/display');

const flags = require('flags');

if (flags.CSSHELPERS) {
    document.body.classList.add('css-helpers');
}
