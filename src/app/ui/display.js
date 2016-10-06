'use strict';

const store = require('store');

let displayElement;

function render() {
    displayElement.innerHTML = `
        <div class='f6'><strong>position</strong>: ${store.get('position') || 0}</div>
        <div class='f6'><strong>rotation</strong>: ${store.get('rotation') || 0}</div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    displayElement = document.querySelector('.display');
    displayElement.classList.add('fixed-font');
    render();
});

store.on('change:position', render);
