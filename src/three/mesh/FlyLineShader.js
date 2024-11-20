import * as THREE from "three";
import gsap from "gsap";
import vertex from "@/shader/flyLine/vertex.glsl";
import fragment from "@/shader/flyLine/fragment.glsl";

export default class FlyLineShader {

  constructor(position={x:0,z:0},Color=0xff0000){
    let FlyLinePoints=[
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(position.x/2,4,position.z/2),
      new THREE.Vector3(position.x,0,position.z),
    ];
    //创建曲线
    this.lineCurve=new THREE.CatmullRomCurve3(FlyLinePoints);
    const points = this.lineCurve.getPoints(1000);
    //创建集合顶点
    this.geometry=new THREE.BufferGeometry().setFromPoints(points);
    //给每一个顶点设置属性
    const aSizeArray = new Float32Array(points.length);
    for(let i=0;i<aSizeArray.length;i++){
      aSizeArray[i]=i;
    }
    this.geometry.setAttribute("aSize",new THREE.BufferAttribute(aSizeArray,1));
   

    //设置着色器材质
    this.shaderMaterial=new THREE.ShaderMaterial({
      vertexShader:vertex,
      fragmentShader:fragment,
      transparent:true,
      blending:THREE.AdditiveBlending,
      uniforms:{
        uTime:{
          value:0
        },
        uColor:{
          value:new THREE.Color(Color)
        },
        uLength:{
          value:points.length,
        },
        uSize:{
          value:0.01
        }
      }
    });

    this.mesh=new THREE.Points(this.geometry,this.shaderMaterial);
    gsap.to(this.shaderMaterial.uniforms.uTime,{
      value:1000,
      duration:1,
      repeat:-1,
      ease:"none"
    });
  }
  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}