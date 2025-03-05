const canvas = element_by_id('finalCanvas');
const ctx = canvas.getContext('2d');
const fileInput = element_by_id('fileInput');
const burgerIconForSidePanel = element_by_id('burgerIconForSidePanel');
const cameraListPanel = element_by_id('cameraListPanel');
const showPointIndexCheckbox = element_by_id('showPointIndex');

function toggleSidePanel() {
  sidePanel.classList.toggle('hidden');
}

function toggleCameraListPanel() {
  cameraListPanel.classList.toggle('hidden');
}

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
