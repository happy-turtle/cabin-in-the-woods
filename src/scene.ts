import {
  BackSide,
  Color,
  Mesh,
  MeshBasicMaterial,
  Scene,
  ShaderMaterial,
  SphereBufferGeometry,
  TextureLoader,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { skybox_fragment, skybox_vertex } from "./shader/skybox";

export async function setupScene(scene: Scene) {
  const gltfLoader = new GLTFLoader();
  const textureLoader = new TextureLoader();

  // load lightmap
  const lightmap = await textureLoader.loadAsync(
    "assets/textures/lightmap.jpg"
  );
  lightmap.flipY = false; //https://discourse.threejs.org/t/loading-lightmap-issue/18882

  // load shack model
  const loadedData = await gltfLoader.loadAsync("assets/cabin.gltf");
  const shack = loadedData.scene;
  shack.position.y += 0.001;
  shack.name = "shack";
  shack.traverse((submodel) => {
    if (submodel instanceof Mesh) {
      submodel.material = new MeshBasicMaterial({
        lightMap: lightmap,
        map: submodel.material.map,
        transparent: true,
        color: submodel.material.color,
      });
    }
  });
  scene.add(shack);

  // create sky
  const vertexShader = skybox_vertex;
  const fragmentShader = skybox_fragment;
  const uniforms = {
    topColor: { value: new Color("skyblue") },
    bottomColor: { value: new Color("blanchedalmond") },
    offset: { value: 10 },
    exponent: { value: 0.6 },
  };

  const skyGeo = new SphereBufferGeometry(50, 32, 15);
  const skyMat = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: BackSide,
  });

  const sky = new Mesh(skyGeo, skyMat);
  scene.add(sky);
}
