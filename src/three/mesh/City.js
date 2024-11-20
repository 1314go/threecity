import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import scene from "../scene";
import modifyCityMaterial from "../modify/modifyCityMaterial";
import FlyLine from "./FlyLine";
import FlyLineShader from "./FlyLineShader";
import MeshLine from "./MeshLine";
import LightWall from "./LightWall";
import LightRadar from "./LightRadar";
import AlarmSprite from "./AlarmSprite";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Clouds, CloudsPlus } from "./Clouds";
import Ocean from "./Ocean";
export default function createCity() {
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load("./model/city.glb",  (gltf)=> {
    console.log(gltf);

       gltf.scene.traverse((item)=>{
      console.log(item);
      if(item.type === "Mesh"){
        const cityMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x00FFFF),
        });
        item.material = cityMaterial;
        modifyCityMaterial(item);
        if(item.name == "Layerbuildings"){
          const meshLine = new MeshLine(item.geometry);
          const size = item.scale.x;
          meshLine.mesh.scale.set(size,size,size);
          scene.add(meshLine.mesh);
        }
      }

    }
   );
      scene.add(gltf.scene);
     

   
      // const flyLine = new FlyLine();
      // scene.add(flyLine.mesh);
      const addClouds = new Clouds();
      scene.add(addClouds.mesh);
      const addCloudsPlus = new CloudsPlus();
      scene.add(addCloudsPlus.mesh);

      const ocean = new Ocean();
      scene.add(ocean.mesh);
      ocean.animate();
    // 添加着色器飞线
      const flyLineShader = new FlyLineShader();
      scene.add(flyLineShader.mesh);
  
      // //添加光墙
      // const lightWall = new LightWall();
      // scene.add(lightWall.mesh);
      //添加雷达
      const lightRadar = new LightRadar();
      scene.add(lightRadar.mesh);
      //添加警示标识
      // const alarmSprite = new AlarmSprite();
      // scene.add(alarmSprite.mesh);
      // alarmSprite.onClick(function (e){
      //   console.log("警告",e);
      // });
  });

}
  
    