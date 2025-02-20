var globalMouseFlag = false;
var globalCameras = [];
var imgURL = "map.png";
var firstScalePoint = null;
var secondScalePoint = null;

document.getElementById("finalCanvas").width = CANVAS_WIDTH;
document.getElementById("finalCanvas").height = CANVAS_HEIGHT;
document.getElementById("tempCanvas").width = CANVAS_WIDTH;
document.getElementById("tempCanvas").height = CANVAS_HEIGHT;

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imgURL = e.target.result;
        firstScalePoint = null;
        secondScalePoint = null;
        drawImageOnCanvas(
          document.getElementById("finalCanvas"),
          e.target.result
        );
      };
      reader.readAsDataURL(file);
    }
  });

window.onload = () => {
  // drawImageOnCanvas(document.getElementById("finalCanvas"), imgURL, () => {});
};

document
  .getElementById("btn_add_fisheye")
  .addEventListener("click", (event) => {
    event.stopPropagation();

    if (
      !document.getElementById("btn_add_fisheye").classList.contains("clicked")
    ) {
      document.getElementById("btn_add_fisheye").classList.add("clicked");
      document.getElementById("btn_add_zoom").classList.remove("clicked");
    } else {
      document.getElementById("btn_add_fisheye").classList.remove("clicked");
    }
  });

document.getElementById("btn_add_zoom").addEventListener("click", (event) => {
  event.stopPropagation();

  if (!document.getElementById("btn_add_zoom").classList.contains("clicked")) {
    document.getElementById("btn_add_zoom").classList.add("clicked");
    document.getElementById("btn_add_fisheye").classList.remove("clicked");
  } else {
    document.getElementById("btn_add_zoom").classList.remove("clicked");
  }
});

document.getElementById("finalCanvas").addEventListener("click", (event) => {
  event.stopPropagation();

  const { offsetX, offsetY } = event;

  if (firstScalePoint == null) {
    firstScalePoint = { x: offsetX, y: offsetY };
    drawCircleToCanvas(
      document.getElementById("finalCanvas"),
      firstScalePoint,
      6,
      "red"
    );
  } else {
    if (secondScalePoint == null) {
      secondScalePoint = { x: offsetX, y: offsetY };
      var ctx = document.getElementById("finalCanvas").getContext("2d");

      ctx.beginPath();
      ctx.moveTo(firstScalePoint.x, firstScalePoint.y);
      ctx.lineTo(secondScalePoint.x, secondScalePoint.y);
      ctx.closePath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
      ctx.fill();
      drawCircleToCanvas(
        document.getElementById("finalCanvas"),
        firstScalePoint,
        6,
        "red"
      );
      drawCircleToCanvas(
        document.getElementById("finalCanvas"),
        secondScalePoint,
        6,
        "red"
      );

      setTimeout(() => {
        var distance = prompt("Enter Distance in meters:", "1");
        ctx.font = "20px Arial";
        ctx.fillStyle = "blue"; // Text color
        ctx.textAlign = "center"; // Align text
        ctx.textBaseline = "middle"; // Align baseline

        // Optionally, draw an outlined text
        ctx.strokeStyle = "blue"; // Outline color
        ctx.lineWidth = 2; // Outline width
        ctx.strokeText(
          distance + "m",
          (firstScalePoint.x + secondScalePoint.x) / 2,
          (firstScalePoint.y + secondScalePoint.y) / 2
        );
      }, 100);
    }
  }

  if (
    document.getElementById("btn_add_fisheye").classList.contains("clicked")
  ) {
    var newFisheyeCam = new Camera("fisheye", offsetX, offsetY);
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
    };

    document.getElementById("camera-list").appendChild(li);
  }
  if (document.getElementById("btn_add_zoom").classList.contains("clicked")) {
    var newZoomCam = new Camera("zoom", offsetX, offsetY);
    globalCameras.push(newZoomCam);

    const li = document.createElement("li");
    li.innerText = newZoomCam.cameraName;

    li.onclick = () => {
      var cameraName = prompt("Enter new camera name:", newZoomCam.cameraName);
      if (!cameraName) return;
      newZoomCam.changeCameraName(cameraName);
      li.innerText = shortenName(cameraName);
    };
    document.getElementById("camera-list").appendChild(li);
  }
});

document.addEventListener("mouseup", function (event) {
  globalCameras.forEach((cam) => {
    cam.draw();
  });
  globalMouseFlag = false;
});
