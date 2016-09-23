const store = require('store');

let displayElement;

function render() {
    displayElement.innerHTML = `
        <div class='f6'><strong>position</strong>: ${store.get('position') || 0}</div>
        <div class='f6'><strong>quaternion</strong>: ${store.get('quaternion') || 0}</div>
        <div class='f6'><strong>lookAt</strong>: ${store.get('lookAt') || 0}</div>
        <div class='f6'><strong>target</strong>: ${store.get('target') || 0}</div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    displayElement = document.querySelector('.display');
    render();
});

store.on('change:position', render);
