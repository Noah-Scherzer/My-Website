const highlight = document.getElementById("highlight");
const permissionBtn = document.getElementById("permission-btn");

function handleOrientation(event) {
  const { beta, gamma } = event;

  const x = Math.min(Math.max(gamma, -45), 45) / 45;
  const y = Math.min(Math.max(beta, -45), 45) / 45;

  const posX = 50 + x * 50;
  const posY = 50 + y * 50;

  highlight.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(255,255,255,0.25), transparent 60%)`;
}

function initSensor() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(response => {
      if (response === 'granted') {
        window.addEventListener("deviceorientation", handleOrientation);
        permissionBtn.style.display = "none";
      } else {
        alert("Zugriff auf Bewegungssensor verweigert.");
      }
    });
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

if (typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function") {
  permissionBtn.style.display = "block";
  permissionBtn.addEventListener("click", initSensor);
} else {
  initSensor();
}