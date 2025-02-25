var globalMouseFlag = false;
var globalCameras = [];
var imgURL = "map.png";
var firstScalePoint = null;
var secondScalePoint = null;
var isScaleSet = false;
var isRotationAllowed = false;
var isReplaceAllowed = false;
var lastSelectedCameraID = null;

document.getElementById("finalCanvas").width = CANVAS_WIDTH;
document.getElementById("finalCanvas").height = CANVAS_HEIGHT;
document.getElementById("tempCanvas").width = CANVAS_WIDTH;
document.getElementById("tempCanvas").height = CANVAS_HEIGHT;
const polygon_menu = document.getElementById("polygon-menu");

function init() {
  firstScalePoint = null;
  secondScalePoint = null;
  isScaleSet = false;
  globalCameras = [];
  document.getElementById("camera-name-list").innerHTML = "";
  document.getElementById("camera-type-list").innerHTML = "";
  document.getElementById("camera-vision-list").innerHTML = "";
}

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imgURL = e.target.result;
        init();
        drawImageOnCanvas(
          document.getElementById("finalCanvas"),
          e.target.result
        );
      };
      reader.readAsDataURL(file);
    }
  });

window.onload = () => {
  drawImageOnCanvas(document.getElementById("finalCanvas"), imgURL, () => {});
};

document.getElementById("btn_add_fisheye").addEventListener("click", (event) => {
    event.stopPropagation();

    if (!isScaleSet) return;

    if (!document.getElementById("btn_add_fisheye").classList.contains("clicked")) {
      document.getElementById("btn_add_fisheye").classList.add("clicked");
      document.getElementById("2mp_btn").classList.remove("clicked");
      document.getElementById("4mp_btn").classList.remove("clicked");
      document.getElementById("8mp_btn").classList.remove("clicked");
    } else {
      document.getElementById("btn_add_fisheye").classList.remove("clicked");
    }
  });

Array.from(document.getElementsByClassName("btn_add_zoom")).forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
  
    if (!isScaleSet) {
      return;
    }
  
    if (!btn.classList.contains("clicked")) {
      Array.from(document.getElementsByClassName("btn_add_zoom")).forEach((b) => {
        b.classList.remove("clicked");
      });
      document.getElementById("btn_add_fisheye").classList.remove("clicked");
      btn.classList.add("clicked");
    } else {
      btn.classList.remove("clicked");
    }
  });
})

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

  if (!isScaleSet) return;

  if (document.getElementById("btn_add_fisheye").classList.contains("clicked")) {
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

    li.id = "name_li_" + newFisheyeCam.cameraID;
    document.getElementById("camera-name-list").appendChild(li);

    const type_li = document.createElement("li");
    type_li.innerText = "Fisheye";
    type_li.id = "type_li_" + newFisheyeCam.cameraID;
    document.getElementById("camera-type-list").appendChild(type_li);

    const checkbox_li = document.createElement("li");

    // Create a checkbox element
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    // Add an event listener to detect changes
    checkbox.addEventListener("change", function () {
      newFisheyeCam.visibility_of_in1 = this.checked ? true : false;
    });

    // Create a checkbox element
    const checkbox2 = document.createElement("input");
    checkbox2.type = "checkbox";
    checkbox2.checked = true;
    // Add an event listener to detect changes
    checkbox2.addEventListener("change", function () {
      newFisheyeCam.visibility_of_in2 = this.checked ? true : false;
    });

    // Create a checkbox element
    const checkbox_out = document.createElement("input");
    checkbox_out.type = "checkbox";
    checkbox_out.checked = true;
    // Add an event listener to detect changes
    checkbox_out.addEventListener("change", function () {
      newFisheyeCam.visibility_of_out = this.checked ? true : false;
    });

    checkbox_li.appendChild(checkbox);
    checkbox_li.appendChild(checkbox2);
    checkbox_li.appendChild(checkbox_out);
    checkbox_li.id = "checkbox_li_" + newFisheyeCam.cameraID;

    document.getElementById("camera-vision-list").appendChild(checkbox_li);
    document.getElementById("btn_add_fisheye").classList.remove("clicked");
  }
  Array.from(document.getElementsByClassName("btn_add_zoom")).forEach((btn) => {
    if (btn.classList.contains("clicked")) {
      var cam_type = "2mp";

      if (btn.id == "2mp_btn") cam_type = "2mp";
      if (btn.id == "4mp_btn") cam_type = "4mp";
      if (btn.id == "8mp_btn") cam_type = "8mp";

      var newZoomCam = new Camera("zoom-" + cam_type, offsetX, offsetY);
      globalCameras.push(newZoomCam);
  
      const li = document.createElement("li");
      li.innerText = newZoomCam.cameraName;
  
      li.onclick = () => {
        var cameraName = prompt("Enter new camera name:", newZoomCam.cameraName);
        if (!cameraName) return;
        newZoomCam.changeCameraName(cameraName);
        li.innerText = shortenName(cameraName);
      };
      li.id = "name_li_" + newZoomCam.cameraID;
      document.getElementById("camera-name-list").appendChild(li);
  
      const type_li = document.createElement("li");
      type_li.innerText = "Zoom " + cam_type;
      type_li.id = "type_li_" + newZoomCam.cameraID;
      document.getElementById("camera-type-list").appendChild(type_li);
  
      const checkbox_li = document.createElement("li");
  
      // Create a checkbox element
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      // Add an event listener to detect changes
      checkbox.addEventListener("change", function () {
        newZoomCam.visibility_of_in1 = this.checked ? true : false;
      });
  
      // Create a checkbox element
      const checkbox2 = document.createElement("input");
      checkbox2.type = "checkbox";
      checkbox2.checked = true;
      // Add an event listener to detect changes
      checkbox2.addEventListener("change", function () {
        newZoomCam.visibility_of_in2 = this.checked ? true : false;
      });
  
      // Create a checkbox element
      const checkbox_out = document.createElement("input");
      checkbox_out.type = "checkbox";
      checkbox_out.checked = true;
      // Add an event listener to detect changes
      checkbox_out.addEventListener("change", function () {
        newZoomCam.visibility_of_out = this.checked ? true : false;
      });
  
      checkbox_li.appendChild(checkbox);
      checkbox_li.appendChild(checkbox2);
      checkbox_li.appendChild(checkbox_out);
      
      checkbox_li.id = "checkbox_li_" + newZoomCam.cameraID;
      document.getElementById("camera-vision-list").appendChild(checkbox_li);
      btn.classList.remove("clicked");
    }
  });
});

document.addEventListener("mouseup", function (event) {
  if (firstScalePoint && secondScalePoint) {
    isScaleSet = true;
    globalCameras.forEach((cam) => {
      cam.draw();
    });
  } else {
    // isScaleSet = false;
  }
  globalMouseFlag = false;
});
