import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const NODE_COUNT = 70;
const MAX_DISTANCE = 2.7;

const positions = [];
const velocities = [];

for (let i = 0; i < NODE_COUNT; i++) {
  positions.push((Math.random() - 0.5) * window.innerWidth /200, (Math.random() - 0.5) * window.innerHeight/200,(Math.random() - 0.5) * Math.max(window.innerWidth /300, window.innerHeight/300));
  velocities.push((Math.random() - 0.5) * 0.003, (Math.random() - 0.5) * 0.003,(Math.random() - 0.5) * 0.003);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05
});

const points = new THREE.Points(geometry, material);
scene.add(points);

let lineGeometry = new THREE.BufferGeometry();
let lineMaterial = new THREE.LineBasicMaterial({
  color: 0x98FB98,
  transparent: true,
  opacity: 0.2
});

let lines = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lines);

function animate() {
  requestAnimationFrame(animate);

  const pos = geometry.attributes.position.array;

  for (let i = 0; i < NODE_COUNT; i++) {
    pos[i*3] += velocities[i*3];
    pos[i*3+1] += velocities[i*3+1];
    pos[i*3+2] += velocities[i*3+2];
        
    if (Math.abs(pos[i*3]) > MAX_DISTANCE) velocities[i*3] *= -1;
    if (Math.abs(pos[i*3+1]) > MAX_DISTANCE) velocities[i*3+1] *= -1;
    if (Math.abs(pos[i*3+2]) > MAX_DISTANCE) velocities[i*3+2] *= -1;
  }

  geometry.attributes.position.needsUpdate = true;

  const linePositions = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {

      const dx = pos[i*3] - pos[j*3];
      const dy = pos[i*3+1] - pos[j*3+1];
      const dz = pos[i*3+2] - pos[j*3+2];

      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

      if (dist < MAX_DISTANCE) {
        linePositions.push(
          pos[i*3], pos[i*3+1], pos[i*3+2],
          pos[j*3], pos[j*3+1], pos[j*3+2]
        );
      }
    }
  }

  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3)
  );

  renderer.render(scene, camera);
}

animate();