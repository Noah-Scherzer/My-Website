const highlight = document.getElementById("highlight");
const permissionBtn = document.getElementById("permission-btn");

function handleOrientation(event) {
  const { beta, gamma } = event;

  // Werte begrenzen
  const clampedGamma = Math.min(Math.max(gamma, -45), 45);
  const clampedBeta = Math.min(Math.max(beta, -45), 45);

  // Werte skalieren
  const x = clampedGamma / 45;
  const y = clampedBeta / 45;

  // Basiswinkel für Licht von oben rechts
  const baseAngle = 135;
  const angleOffset = x * 20 + y * 15;
  const angle = baseAngle + angleOffset;

  // Position für Verlauf
  const lightPos = 30 + x * 20; // Optional für Position im Verlauf

  highlight.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.2) ${lightPos}%, transparent ${lightPos + 40}%)`;
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