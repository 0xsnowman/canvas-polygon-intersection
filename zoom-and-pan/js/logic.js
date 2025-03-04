let image = new Image();
let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let startX, startY;

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
}

function drag(e) {
  if (!isDragging) return;
  originX = e.clientX - startX;
  originY = e.clientY - startY;
  drawImage();
}

function stopDragging() {
  isDragging = false;
  canvas.style.cursor = 'grab';
}
