window.addEventListener('resize', resizeCanvas);

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) loadImage(file);
});

canvas.addEventListener('wheel', zoom);
canvas.addEventListener('mousedown', startDragging);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', stopDragging);
canvas.addEventListener('mouseleave', stopDragging);

showPointIndexCheckbox.addEventListener('change', (e) => {
  const isChecked = e.target.checked;
  console.log('Show Point Index:', isChecked);
});

const closeButton = document.getElementById('closeButton');
closeButton.addEventListener('click', closePanel);

const statePanelCloseButton = document.getElementById('statePanelCloseButton');
statePanelCloseButton.addEventListener('click', closeStatePanel);
