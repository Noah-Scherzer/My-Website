// Initial variables for smooth movement
let targetXPercent = 50; // Zielposition (wird von der Maus bestimmt)
let targetYPercent = 50;
let currentXPercent = 50; // Aktuelle Position (wird langsam angepasst)
let currentYPercent = 50;

// Interpolation function (lerp)
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Update function for the background
function updateGradient() {
    // Interpolate between current and target positions
    currentXPercent = lerp(currentXPercent, targetXPercent, 0.01); // Adjust 0.1 for speed
    currentYPercent = lerp(currentYPercent, targetYPercent, 0.01);

    // Update background with smoothed position
    document.body.style.background = `radial-gradient(circle at ${currentXPercent}% ${currentYPercent}%, #1d1428, #080808, #080808)`;

    // Continue the animation
    requestAnimationFrame(updateGradient);
}

// Mouse move event to update target position
document.addEventListener('mousemove', (event) => {
    const x = event.pageX; // X position of the mouse
    const y = event.pageY; // Y position of the mouse
    const width = window.innerWidth; // Total width of the viewport
    const height = document.body.scrollHeight; // Total height of the document

    // Calculate percentages for target gradient center
    targetXPercent = (x / width) * 100;
    targetYPercent = (y / height) * 100;
});

// Start the animation loop
updateGradient();
