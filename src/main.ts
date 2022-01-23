import {
  BoxBufferGeometry,
  BufferGeometry,
  Clock,
  Color,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  sRGBEncoding,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module";
import { setupScene } from "./scene";

// Get a reference to the container element that will hold our scene
const container = document.getElementById("scene-container");

if (container === null) {
  throw "container is null";
}

// create a Scene
const scene = new Scene();

// Set the background color
scene.background = new Color("skyblue");

// Create a camera
const fov = 15; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

const camera = new PerspectiveCamera(fov, aspect, near, far);

// every object is initially created at ( 0, 0, 0 )
// move the camera back so we can view the scene
camera.position.set(-18.7, 10, 26.7);

// additional scene objects
await setupScene(scene);

// create the renderer
const renderer = new WebGLRenderer({ antialias: true });
renderer.outputEncoding = sRGBEncoding;

// next, set the renderer to the same size as our container element
renderer.setSize(container.clientWidth, container.clientHeight);
// finally, set the pixel ratio so that our scene will look good on HiDPI displays
renderer.setPixelRatio(window.devicePixelRatio);

// add the automatically created <canvas> element to the page
const canvas = renderer.domElement;
container.append(canvas);

// create orbit control
const orbitControl = new OrbitControls(camera, canvas);
orbitControl.maxPolarAngle = Math.PI / 2 - 0.1;
orbitControl.enableDamping = true;
orbitControl.maxDistance = 50;
orbitControl.minDistance = 5;
orbitControl.enablePan = false;
orbitControl.rotateSpeed = camera.aspect > 1 ? 0.2 : 0.4;
orbitControl.target = new Vector3(0, 0.5, 0);

// listen for window resize
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.render(scene, camera);
  orbitControl.rotateSpeed = camera.aspect > 1 ? 0.2 : 0.4;
});

// setup selection control
canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointerup", onPointerUp);
const raycaster = new Raycaster();

let pointer = {
  x: 0,
  y: 0,
  isPrimary: false,
};

function onPointerDown(event: PointerEvent) {
  pointer = {
    x: (event.clientX / canvas.clientWidth) * 2 - 1,
    y: -(event.clientY / canvas.clientHeight) * 2 + 1,
    isPrimary: event.button === 0,
  };
}

// raycast cube
const cubeGeo = new BoxBufferGeometry(0.6, 0.4, 0.2);
const cubeMaterial = new MeshBasicMaterial();
cubeMaterial.visible = false;
const cube = new Mesh(cubeGeo, cubeMaterial);
cube.position.set(-4.5, 0.44, 6.4);
cube.rotateY(-10);
scene.add(cube);

function onPointerUp(event: PointerEvent) {
  if (!pointer.isPrimary) return;

  const pointerMovement = new Vector2(
    pointer.x - ((event.clientX / canvas.clientWidth) * 2 - 1),
    pointer.y - (-(event.clientY / canvas.clientHeight) * 2 + 1)
  );
  if (pointerMovement.length() >= 0.01) return;

  raycaster.setFromCamera({ x: pointer.x, y: pointer.y }, camera);
  const intersections = raycaster.intersectObject(cube);
  if (intersections.length > 0) {
    window.open("https://github.com/happy-turtle/");
  }
}

// Selection Wireframe
const signOutline: Array<Vector3> = [
  new Vector3(-4.65, 0.3, 6.37),
  new Vector3(-4.65, 0.58, 6.37),
  new Vector3(-4.18, 0.58, 6.37),
  new Vector3(-4.18, 0.3, 6.37),
  new Vector3(-4.65, 0.3, 6.37),
];
const lineGeometry = new BufferGeometry().setFromPoints(signOutline);
const matLine = new LineBasicMaterial({
  color: 0xfcfcfc,
  linewidth: 1,
  linecap: "round", //ignored by WebGLRenderer
  linejoin: "round", //ignored by WebGLRenderer
});
const selectionOutline = new Line(lineGeometry, matLine);
scene.add(selectionOutline);

// set render loop
renderer.setAnimationLoop(() => {
  orbitControl.update();
  // stats.update();
});

orbitControl.addEventListener("change", () => renderer.render(scene, camera));

// debug
// const stats = Stats();
// container.appendChild(stats.dom);
