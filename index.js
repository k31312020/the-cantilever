
import './style.css';

const scene = new THREE.Scene();

const hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
scene.add(hemisphereLight);

const spotLight = new THREE.SpotLight(0xffffff, 8);
spotLight.position.set(0,50,150);
spotLight.angle = Math.PI/5;
spotLight.penumbra = 1;
spotLight.decay = 1;
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;

spotLight.castShadow = true;
scene.add(spotLight);

const spotLight_2 = new THREE.SpotLight(0xffffff, 10);
spotLight_2.position.set(0, -400, 0);
spotLight_2.angle = 0.4;
spotLight_2.penumbra = 0.1;
spotLight_2.decay = 1;
spotLight_2.distance = 1000;
spotLight_2.shadow.bias = -0.0001;

spotLight_2.castShadow = true;
scene.add(spotLight_2);

scene.background = new THREE.Color(0xe6f9ff);

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.25,
  20
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new THREE.GLTFLoader();
loader.load(
  "https://assets.codepen.io/4217721/the_cantilever.glb",
  function (gltf) {
    const model = gltf.scene;
    model.traverse((node) => {
      if (node.isMesh) {
        node.material.flatShading = true;
        node.receiveShadow = true;
        node.castShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    gltf.scene.position.x += gltf.scene.position.x - center.x;
    gltf.scene.position.y += gltf.scene.position.y - center.y;
    gltf.scene.position.z += gltf.scene.position.z - center.z;

    camera.near = size / 100;
    camera.far = size * 100;

    camera.updateProjectionMatrix();

    camera.position.copy(center);

    camera.position.x += size * 1.1;
    camera.position.y += size / 5;
    camera.position.z += (size - 1000)/5;
    camera.lookAt(center);

    controls.maxDistance = size * 1.3;
    controls.minDistance = size / 1.3;
  //   controls.enableZoom = false;
    controls.update();

    scene.add(model);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();