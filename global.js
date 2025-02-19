var globalMouseFlag = false;
var globalCameras = [];
var imgURL = "map.png";

document.getElementById("finalCanvas").width = CANVAS_WIDTH;
document.getElementById("finalCanvas").height = CANVAS_HEIGHT;
document.getElementById("tempCanvas").width = CANVAS_WIDTH;
document.getElementById("tempCanvas").height = CANVAS_HEIGHT;

document.getElementById("fileInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          imgURL = e.target.result;
          drawImageOnCanvas(document.getElementById("finalCanvas"), e.target.result);
      };
      reader.readAsDataURL(file);
  }
});

window.onload = () => {
  drawImageOnCanvas(document.getElementById("finalCanvas"), imgURL, () => {});
};

document.getElementById("btn_add_fisheye").addEventListener("click", (event) => {
  event.stopPropagation();

  var newFisheyeCam = new Camera("fisheye");
  globalCameras.push(newFisheyeCam);

  const li = document.createElement("li");
  li.innerText = newFisheyeCam.cameraName;
  li.onclick = () => {
    var cameraName = prompt(
      "Enter new camera name:",
      newFisheyeCam.cameraName
    );
    if (!cameraName) return;
    newFisheyeCam.changeCameraName(cameraName);
    li.innerText = shortenName(cameraName);
  }

  document.getElementById("camera-list").appendChild(li);
});

document.getElementById("btn_add_zoom").addEventListener("click", (event) => {
  event.stopPropagation();

  var newZoomCam = new Camera("zoom");
  globalCameras.push(newZoomCam);

  const li = document.createElement("li");
  li.innerText = newZoomCam.cameraName;

  li.onclick = () => {
    var cameraName = prompt(
      "Enter new camera name:",
      newZoomCam.cameraName
    );
    if (!cameraName) return;
    newZoomCam.changeCameraName(cameraName);
    li.innerText = shortenName(cameraName);
  }
  document.getElementById("camera-list").appendChild(li);
});

document.addEventListener("mouseup", function (event) {
  globalCameras.forEach((cam) => {
    cam.draw();
  });
  globalMouseFlag = false;
});
