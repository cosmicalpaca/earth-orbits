const store = require('store');

let displayElement;

store.on('change:position', render);

function render() {
    displayElement.innerHTML = `
        <strong>position</strong>: ${store.get('position') || 0}\n
        <strong>quaternion</strong>: ${store.get('quaternion') || 0}\n
        <strong>lookAt</strong>: ${store.get('lookAt') || 0}\n
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    displayElement = document.querySelector('#display');
    render();
});
