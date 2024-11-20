import * as THREE from "three";
import gsap from "gsap";
import { Water } from "three/examples/jsm/objects/Water.js";

export default class Ocean {
  constructor(radius = 50) {
    this.clock = new THREE.Clock(); // 创建一个计时器
    // 创建水平
    const TextureLoader = new THREE.TextureLoader();
    this.waterGeometry = new THREE.CircleGeometry(radius, 32);
    this.water = new Water(this.waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      
      waterNormals: new THREE.TextureLoader().load( './textures/waternormals.jpg', function ( texture ) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      } ),
      alpha: 1.0,

      
      //flowDirection: new THREE.Vector2(1, 1),
      //scale: 100,
      distortionScale: 7,
      sunColor: 0xffffff,
						waterColor: 0x001e0f,
    });
    this.water.position.y = 0;
    this.water.rotation.x = -Math.PI / 2;
    this.mesh = this.water;
    this.water.renderOrder = -1;
    

  
  }
 
  animate() {

    requestAnimationFrame(this.animate.bind(this));
    this.render();

  }

  render() {
    const delta = this.clock.getDelta(); // 获取时间差
    this.water.material.uniforms["time"].value += delta*1.5; // 更新时间属性

    // 示例：假设存在sphere和renderer等对象
    // sphere.position.y = Math.sin(performance.now() * 0.001) * 20 + 5;
    // sphere.rotation.x = performance.now() * 0.001 * 0.5;
    // sphere.rotation.z = performance.now() * 0.001 * 0.51;
    // renderer.render(scene, camera);
  }
  }
  

