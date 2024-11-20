// src/utils/SkyController.js
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export default class SkyController {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.sun = new THREE.Vector3();
    
    // 初始化天空
    this.sky = new Sky();
    this.sky.scale.setScalar(450000);
    this.scene.add(this.sky);
    
    // 初始化 uniforms
    this.effectController = {
      turbidity: 16,
      rayleigh: 6,
      mieCoefficient: 0.009,
      mieDirectionalG: 0.8,
      luminance: 9,
      inclination: 0.49,  // 地平线上的太阳角度
      azimuth: 0.45,     // 方位角
      sun: !true          // 如果是 true，禁用太阳效果
    };
    
    this.initSky();
  }

  initSky() {
    this.updateSky();
  }

  updateSky() {
    const uniforms = this.sky.material.uniforms;
    uniforms['turbidity'].value = this.effectController.turbidity;
    uniforms['rayleigh'].value = this.effectController.rayleigh;
    uniforms['mieCoefficient'].value = this.effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = this.effectController.mieDirectionalG;
    //uniforms['luminance'].value = this.effectController.luminance;

    // 更新太阳位置
    const theta = Math.PI * (this.effectController.inclination - 0.5);
    const phi = 2 * Math.PI * (this.effectController.azimuth - 0.5);

    this.sun.x = Math.cos(phi);
    this.sun.y = Math.sin(phi) * Math.sin(theta);
    this.sun.z = Math.sin(phi) * Math.cos(theta);

    uniforms['sunPosition'].value.copy(this.sun);
    this.renderer.render(this.scene, this.camera);
  }

  // 允许外部通过此方法更新参数
  setParameters(params) {
    this.effectController = { ...this.effectController, ...params };
    this.updateSky();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.updateSky();
  }
}
