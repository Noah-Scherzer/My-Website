(function() {
  const canvas = document.getElementById('background-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Offscreen-Canvas für das Notizblock-Muster
  const size = 64;
  const offCanvas = document.createElement('canvas');
  offCanvas.width = offCanvas.height = size;
  const ctx = offCanvas.getContext('2d');
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'darkgray';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, size - 1);
  ctx.lineTo(size, size - 1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(10, size);
  ctx.stroke();
  
  const texture = new THREE.CanvasTexture(offCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(300, 300);

  // Metallische Ebene mit dem Notizblock-Muster
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    metalness: 1,
    roughness: 0.5,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI;
  scene.add(plane);

  // Warmweißes Licht (DirectionalLight)
  const light = new THREE.DirectionalLight(0xffdcb9, 10);
  light.position.set(0, 50, 10);
  scene.add(light);

  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', event => {
    mouseX = event.clientX / window.innerWidth;
    mouseY = event.clientY / window.innerHeight;
  });

  function animate() {
    requestAnimationFrame(animate);
    plane.rotation.y = (mouseX - 0.5) * 0.1;
    plane.rotation.x = (mouseY - 0.5) * 0.1;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();