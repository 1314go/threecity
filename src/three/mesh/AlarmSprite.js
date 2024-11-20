import * as THREE from "three"; 
import camera from "../camera";
export default class AlarmSprite{
  constructor(type="火警",position={x:-1.8,z:3},color=0xff0000){
    const TextureLoader = new THREE.TextureLoader();

    const typeObj ={
      "火警":"./textures/tag/fire.png",
      "安全":"./textures/tag/safe.png",
      "电力":"./textures/tag/e.png",
      "治安":"./textures/tag/jingcha.png"

    
    }

    const map = TextureLoader.load( typeObj[type]);
    this.material = new THREE.SpriteMaterial( { map: map,color: 0xff0000 ,
    transparent: true,
    } );

    this.mesh = new THREE.Sprite( this.material );
   
    this.mesh.position.set(position.x,2.5,position.z);

    //封装点击事件，经过投射光线检测获取点击对象
    this.fns=[];
    //创建射线
    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    window.addEventListener('click',(event)=>{
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
     
      this.raycaster.setFromCamera(this.mouse, camera);
      event.mesh = this.mesh;
      event.alarm=this;
      const intersects = this.raycaster.intersectObject(  this.mesh  );
      if(intersects.length>0){
      this.fns.forEach((fn)=>{
        fn(event);
      });
    }
})
  }
  onClick(fn){
    this.fns.push(fn);

  }
  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}