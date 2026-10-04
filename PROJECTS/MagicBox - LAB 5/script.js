const boxes = document.getElementById('boxes');
const button = document.getElementById('btn');
const gridSize = 4;

// Every tile displays a unique quarter-by-quarter part of the same GIF.
for (let row = 0; row < gridSize; row++) {
  for (let column = 0; column < gridSize; column++) {
    const box = document.createElement('div');
    box.className = 'box';
    box.style.backgroundPosition = `${-column * 125}px ${-row * 125}px`;
    boxes.appendChild(box);
  }
}

button.addEventListener('click', () => {
  boxes.classList.toggle('big');
  button.setAttribute('aria-pressed', boxes.classList.contains('big'));
});
