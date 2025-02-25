function shortenName(name) {
  if (!name || name == undefined) return "CAM-ERR";
  if (name.length > 7) {
    return name.substr(0, 2) + "..." + name.substr(name.length - 3, 3);
  }
  return name;
}

function toRadians(angle) {
  return Math.PI / 180 * angle;
}

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

document.getElementById("fisheye-allow-rotate").addEventListener("click", () => {
  isRotationAllowed = true;
  hideMenu(fisheye_menu);
});

document.getElementById("fisheye-allow-move").addEventListener("click", () => {
  isReplaceAllowed = true;
  hideMenu(fisheye_menu);
});

document.getElementById("fisheye-delete-polygon").addEventListener("click", () => {
  const selectedIndex = globalCameras.findIndex(
    (cam) => cam.cameraID == lastSelectedCameraID
  );

  if (selectedIndex != undefined) {
    document.getElementById("camera-name-list").childNodes.forEach((node) => {
      if (node.id == "name_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
    document.getElementById("camera-type-list").childNodes.forEach((node) => {
      if (node.id == "type_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
    document.getElementById("camera-vision-list").childNodes.forEach((node) => {
      if (node.id == "checkbox_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
  }
  
  globalCameras = globalCameras.filter((cam) => {
    return cam.cameraID != lastSelectedCameraID;
  });

  hideMenu(fisheye_menu);
});


document.getElementById("zoom-allow-rotate").addEventListener("click", () => {
  isRotationAllowed = true;
  hideMenu(zoom_menu);
});

document.getElementById("zoom-allow-move").addEventListener("click", () => {
  isReplaceAllowed = true;
  hideMenu(zoom_menu);
});

document.getElementById("zoom-delete-polygon").addEventListener("click", () => {
  const selectedIndex = globalCameras.findIndex(
    (cam) => cam.cameraID == lastSelectedCameraID
  );

  if (selectedIndex != undefined) {
    document.getElementById("camera-name-list").childNodes.forEach((node) => {
      if (node.id == "name_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
    document.getElementById("camera-type-list").childNodes.forEach((node) => {
      if (node.id == "type_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
    document.getElementById("camera-vision-list").childNodes.forEach((node) => {
      if (node.id == "checkbox_li_" + lastSelectedCameraID) {
        node.remove();
      }
    });
  }
  
  globalCameras = globalCameras.filter((cam) => {
    return cam.cameraID != lastSelectedCameraID;
  });

  hideMenu(zoom_menu);
});

function changeZoomAngle(angle) {
  globalCameras.find((cam) => cam.cameraID == lastSelectedCameraID).changeCameraAngle(angle / 2);
  hideMenu(zoom_menu);
}