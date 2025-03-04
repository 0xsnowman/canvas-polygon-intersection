const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const burgerIcon = document.getElementById('burgerIcon');
const sidePanel = document.getElementById('sidePanel');
const cameraButtons = document.querySelectorAll('.buttons button');
const showPointIndexCheckbox = document.getElementById('showPointIndex');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawImage();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawImage() {
  clearCanvas();
  ctx.save();
  ctx.translate(originX, originY);
  ctx.scale(scale, scale);
  if (image.complete) {
    ctx.drawImage(image, 0, 0);
  }
  ctx.restore();
}

function togglePanel() {
  sidePanel.classList.toggle('hidden');
}

cameraButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    console.log(`Camera ${index + 1} clicked`);
    // Add camera switch logic here
  });
});
