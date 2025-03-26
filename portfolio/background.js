(function() {
  // --- Konfiguration ---
  const PARTICLE_COUNT = 500000;
  const SPHERE_RADIUS = 50; // Maximale Entfernung vom Ursprung, in der Partikel spawnen

  // --- Szene, Renderer und Kamera ---
  const canvas = document.getElementById('background-canvas');
  const scene = new THREE.Scene();
  
  // Kamera-Pivot für Drehungen (damit nur die Kamera rotiert und nicht die Platte)
  const cameraPivot = new THREE.Object3D();
  scene.add(cameraPivot);
  
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraPivot.add(camera);
  camera.position.set(0, 0, 10);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // --- Notizblock-Muster-Textur erstellen ---
  const textureSize = 64;
  const offCanvas = document.createElement('canvas');
  offCanvas.width = offCanvas.height = textureSize;
  const ctx = offCanvas.getContext('2d');
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, textureSize, textureSize);
  ctx.strokeStyle = 'darkgray';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, textureSize - 1);
  ctx.lineTo(textureSize, textureSize - 1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(10, textureSize);
  ctx.stroke();
  
  const boardTexture = new THREE.CanvasTexture(offCanvas);
  boardTexture.wrapS = THREE.RepeatWrapping;
  boardTexture.wrapT = THREE.RepeatWrapping;
  boardTexture.repeat.set(300, 300);
  
  // --- Metallische Ebene mit dem Notizblock-Muster ---
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: boardTexture,
    metalness: 1,
    roughness: 0.5,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI;
  scene.add(plane);
  
  // --- Warmweißes Licht ---
  const light = new THREE.DirectionalLight(0xffdcb9, 10);
  light.position.set(0, 50, 10);
  scene.add(light);
  
  // --- Partikel erzeugen (nur in einem Kugelvolumen) ---
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  
  // Gleichmäßige Verteilung im Volumen einer Kugel
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = SPHERE_RADIUS * Math.cbrt(Math.random()); // cube root sorgt für gleichmäßige Volumenverteilung
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    
    // Langsame, zufällige Geschwindigkeiten
    velocities[i * 3]     = (Math.random() - 0.5) * 0.002;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // --- Partikel-Sprite erstellen ---
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = particleCanvas.height = 64;
  const particleCtx = particleCanvas.getContext('2d');
  const gradient = particleCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,232,201,0.6)');
  gradient.addColorStop(1, 'rgba(255,232,201,0)');
  particleCtx.fillStyle = gradient;
  particleCtx.fillRect(0, 0, 64, 64);
  const particleTexture = new THREE.CanvasTexture(particleCanvas);
  
  const particlesMaterial = new THREE.PointsMaterial({
    map: particleTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    size: 0.05,
    depthWrite: false,
    color: 0xfff8e7
  });
  
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
  
  // --- Interaktion: Maus und Scroll ---
  let mouseX = 0, mouseY = 0, scrollPos = 0;
  
  document.addEventListener('mousemove', event => {
    mouseX = - (event.clientX / window.innerWidth);
    mouseY = event.clientY / window.innerHeight;
  });
  
  window.addEventListener('scroll', () => {
    scrollPos = window.scrollY;
  });
  
  // --- Animationsschleife ---
  function animate() {
    requestAnimationFrame(animate);
    
    // Kamera-Pivot: Bewege die Kamera bei Scrollen und rotiere sie bei Mausbewegung
    cameraPivot.position.y = -scrollPos * 0.002;
    cameraPivot.rotation.y = (mouseX + 0.5) * 0.2;
    cameraPivot.rotation.x = -(mouseY - 0.5) * 0.2;
    
    // Partikel: Positionen aktualisieren und in der Kugel bleiben
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const index = i * 3;
      positions[index]     += velocities[index];
      positions[index + 1] += velocities[index + 1];
      positions[index + 2] += velocities[index + 2];
      
      // Bleibe innerhalb der Kugel
      const distSq = positions[index]**2 + positions[index + 1]**2 + positions[index + 2]**2;
      if (distSq > SPHERE_RADIUS * SPHERE_RADIUS) {
        const dist = Math.sqrt(distSq);
        positions[index]     = (positions[index] / dist) * SPHERE_RADIUS;
        positions[index + 1] = (positions[index + 1] / dist) * SPHERE_RADIUS;
        positions[index + 2] = (positions[index + 2] / dist) * SPHERE_RADIUS;
        // Umkehren der Geschwindigkeit
        velocities[index]     = -velocities[index];
        velocities[index + 1] = -velocities[index + 1];
        velocities[index + 2] = -velocities[index + 2];
      }
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
  }
  animate();
  
  // --- Größenanpassung ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();