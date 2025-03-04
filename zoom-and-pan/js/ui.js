const canvas = element_by_id('finalCanvas');
const ctx = canvas.getContext('2d');
const fileInput = element_by_id('fileInput');
const burgerIconForSidePanel = element_by_id('burgerIconForSidePanel');
const cameraListPanel = element_by_id('cameraListPanel');
const cameraButtons = document.querySelectorAll('.buttons button');
const showPointIndexCheckbox = element_by_id('showPointIndex');

function toggleSidePanel() {
  sidePanel.classList.toggle('hidden');
}

function toggleCameraListPanel() {
  cameraListPanel.classList.toggle('hidden');
}

cameraButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    console.log(`Camera ${index + 1} clicked`);
    // Add camera switch logic here
  });
});

function closeSidePanel() {
  const sidePanel = element_by_id('sidePanel');
  sidePanel.classList.add('hidden');
}

function closeStatePanel() {
  const statePanel = element_by_id('statePanel');
  statePanel.classList.add('hidden');
}

function closeCameraListPanel() {
  const cameraListPanel = element_by_id('cameraListPanel');
  cameraListPanel.classList.add('hidden');
}
