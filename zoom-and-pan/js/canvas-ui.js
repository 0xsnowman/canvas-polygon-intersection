// Show the menu at the click position
function showMenu(menu, x, y, cameraID, type) {
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.display = "block";
  lastSelectedCameraID = cameraID;
}

// Hide the menu
function hideMenu(menu) {
  menu.style.display = "none";
}

element_by_id("fisheye-allow-rotate").addEventListener("click", () => {
  isRotationAllowed = true;
  hideMenu(fisheye_menu);
});

element_by_id("fisheye-allow-move").addEventListener("click", () => {
  isReplaceAllowed = true;
  hideMenu(fisheye_menu);
});

element_by_id("fisheye-delete-polygon").addEventListener("click", () => {
  const selectedIndex = globalCameras.findIndex(
    (cam) => cam.cameraID == lastSelectedCameraID
  );

  if (selectedIndex != undefined) {
    element_by_id("camera-name-list").childNodes.forEach((node) => {
      if (node.id == "name_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
    element_by_id("camera-type-list").childNodes.forEach((node) => {
      if (node.id == "type_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
    element_by_id("camera-vision-list").childNodes.forEach((node) => {
      if (node.id == "checkbox_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
  }

  globalCameras = globalCameras.filter(
    (cam) => cam.cameraID !== lastSelectedCameraID
  );

  hideMenu(fisheye_menu);
  redrawEntireCanvas();
});

element_by_id("zoom-allow-rotate").addEventListener("click", () => {
  isRotationAllowed = true;
  hideMenu(zoom_menu);
});

element_by_id("zoom-allow-move").addEventListener("click", () => {
  isReplaceAllowed = true;
  hideMenu(zoom_menu);
});

element_by_id("zoom-delete-polygon").addEventListener("click", () => {
  const selectedIndex = globalCameras.findIndex(
    (cam) => cam.cameraID == lastSelectedCameraID
  );

  if (selectedIndex != undefined) {
    element_by_id("camera-name-list").childNodes.forEach((node) => {
      if (node.id == "name_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
    element_by_id("camera-type-list").childNodes.forEach((node) => {
      if (node.id == "type_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
    element_by_id("camera-vision-list").childNodes.forEach((node) => {
      if (node.id == "checkbox_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
  }

  globalCameras = globalCameras.filter(
    (cam) => cam.cameraID !== lastSelectedCameraID
  );

  hideMenu(zoom_menu);
  redrawEntireCanvas();
});

function changeZoomAngle(angle) {
  globalCameras
    .find((cam) => cam.cameraID == lastSelectedCameraID)
    .changeCameraAngle(angle / 2);
  hideMenu(zoom_menu);
}

element_by_id("show-point-index").addEventListener("change", (event) => {
  event.stopPropagation();
  globalShowPointIndexFlag = element_by_id("show-point-index").checked;
  redrawEntireCanvas();
});
