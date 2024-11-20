import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import Ocean from "./mesh/Ocean";
// 初始化场景
const scene = new THREE.Scene();

// // 场景天空盒
// const textureCubeLoader = new THREE.CubeTextureLoader().setPath("./textures/");
// const textureCube = textureCubeLoader.load([
//   "1.jpg",
//   "2.jpg",
//   "3.jpg",
//   "4.jpg",
//   "5.jpg",
//   "6.jpg",
// ]);

// scene.background = textureCube;
// scene.environment = textureCube;

// let rgbeLoader = new RGBELoader();
// rgbeLoader.load("./texture/kloppenheim_02_4k.hdr", (envMap) => {
//   // 设置球形贴图
//   // envMap.mapping = THREE.EquirectangularReflectionMapping;
//   envMap.mapping = THREE.EquirectangularRefractionMapping;
//   // 设置环境贴图
//   scene.background = envMap;
//   // 设置环境贴图
//   scene.environment = envMap;


  
// });


export default scene;
