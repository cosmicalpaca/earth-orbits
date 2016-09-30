'use strict';

const store = require('store');

let displayElement;

document.addEventListener('DOMContentLoaded', () => {
    displayElement = document.querySelector('.display');
    displayElement.classList.add('fixed-font');
    render();
});

function render() {
    displayElement.innerHTML = `
        <div class='f6'><strong>position</strong>: ${store.get('position') || 0}</div>
        <div class='f6'><strong>quaternion</strong>: ${store.get('quaternion') || 0}</div>
        <div class='f6'><strong>lookAt</strong>: ${store.get('lookAt') || 0}</div>
        <div class='f6'><strong>target</strong>: ${store.get('target') || 0}</div>
    `;
}

store.on('change:position', render);
