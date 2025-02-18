var globalMouseFlag = false;
var globalCameras = [];

document.getElementById("btn_add_fisheye").addEventListener("click", () => {
  var newFisheyeCam = new Camera("fisheye");
  globalCameras.push(newFisheyeCam);

  const li = document.createElement("li");
  li.innerText = newFisheyeCam.cameraID + " ";

  // Create the Remove button
  // const removeBtn = document.createElement("button");
  // removeBtn.innerText = "Remove";
  // removeBtn.style.marginLeft = "10px"; // Add spacing

  // removeBtn.addEventListener("click", () => {
  //   const cameraID = li.firstChild.textContent.trim(); // Extract camera ID from li
  //   const isConfirmed = confirm(
  //     `Are you sure you want to remove camera: ${cameraID}?`
  //   );

  //   if (isConfirmed) {
  //     // Remove the camera from the globalCameras array
  //     console.log(globalCameras);
  //     globalCameras = globalCameras.filter((cam) => cam.cameraID !== cameraID);

  //     li.remove(); // Remove the list item
  //   }
  // });

  // li.appendChild(removeBtn); // Append button to list item
  document.getElementById("camera-list").appendChild(li);
});

document.getElementById("btn_add_zoom").addEventListener("click", () => {
  var newZoomCam = new Camera("zoom");
  globalCameras.push(newZoomCam);

  const li = document.createElement("li");
  li.innerText = newZoomCam.cameraID;
  document.getElementById("camera-list").appendChild(li);
});

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "z") {
    camera.restoreCamera();
  }
});

document.addEventListener("mouseup", function (event) {
  globalCameras.forEach((cam) => {
    cam.draw();
  });
  globalMouseFlag = false;
});
