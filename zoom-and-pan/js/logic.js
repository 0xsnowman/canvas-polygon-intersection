let image = new Image();
let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let startX, startY;
let flagShowGrid = true;

// Variables for grid settings
const gridSize = 30; // Size of each grid square (adjust as needed)
const gridColor = '#cccccc'; // Color of the grid lines


function loadImage(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

image.onload = () => {
  resizeCanvas();
  drawImage();
};


function zoom(e) {
  e.preventDefault();
  const zoomFactor = e.deltaY > 0 ? 1 - ZOOM_INTENSITY : 1 + ZOOM_INTENSITY;
  scale *= zoomFactor;
  scale = Math.min(Math.max(MIN_SCALE, scale), MAX_SCALE);
  drawImage();
}

function startDragging(e) {
  isDragging = true;
  startX = e.clientX - originX;
  startY = e.clientY - originY;
  canvas.style.cursor = 'grabbing';
  updateStatePanel();
}

function drag(e) {
  if (!isDragging) return;
  originX = e.clientX - startX;
  originY = e.clientY - startY;
  drawImage();
  updateStatePanel();
}

function stopDragging() {
  isDragging = false;
  canvas.style.cursor = 'grab';
  updateStatePanel();
}
