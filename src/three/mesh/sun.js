// Sun.js
import * as THREE from 'three';

export default class Sun {
  constructor(position={x:0,y:0,z:0}) {
    // 创建太阳的主场景
    this.scene = new THREE.Scene();

    // 创建几何体
    const geometry = new THREE.SphereGeometry(2.0, 32, 32);

    // 创建主太阳材质
    const materialSun = new THREE.ShaderMaterial({
      vertexShader: this.sunVertexTexture(),
      fragmentShader: this.sunFragmentTexture(),
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uPerlin: { value: null }
      }
    });

    // 创建太阳网格并添加到场景中
    this.Sun = new THREE.Mesh(geometry, materialSun);
    this.Sun.position.set(position.x, position.y, position.z);
    this.scene.add(this.Sun);

//     // 创建辅助场景用于生成噪声纹理
//     this.scene2 = new THREE.Scene();

//     // 创建噪声球体的几何体和材质
//     const noiseGeo = new THREE.SphereGeometry(2.0, 32, 32);
//     const materialnoise = new THREE.ShaderMaterial({
//       vertexShader: this.sunVertexShader(),
//       fragmentShader: this.sunFragmentShader(),
//       side: THREE.DoubleSide,
//       uniforms: {
//         uTime: { value: 0 }
//       }
//     });

//     // 创建噪声球体并添加到辅助场景中
//     this.noiseSun = new THREE.Mesh(noiseGeo, materialnoise);
//     //this.noiseSun.scale.set(position.x, position.y, position.z);
//     this.noiseSun.position.set(position.x, position.y, position.z);
//     //this.scene2.add(this.noiseSun);

//     // 创建立方体渲染目标和立方体相机
//     this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
//       generateMipmaps: true,
//       minFilter: THREE.LinearMipmapLinearFilter
//     });
//     this.cubeCamera = new THREE.CubeCamera(1, 100000, this.cubeRenderTarget);
//     this.cubeCamera.position.copy(this.noiseSun.position);
//     //this.scene2.add(this.cubeCamera);
// // 创建纹理生成场景
//         this.textureScene = new THREE.Scene();

// // 添加噪声球体和 cubeCamera 到纹理生成场景
//       this.textureScene.add(this.noiseSun);
//       this.textureScene.add(this.cubeCamera);

    // // 创建太阳外部光晕
    // const sunRundGeo = new THREE.SphereGeometry(4.0, 32, 32);
    // const rundSun = new THREE.ShaderMaterial({
    //   vertexShader: this.sunRundVertexTexture(),
    //   fragmentShader: this.sunRundFragmentTexture(),
    //   side: THREE.BackSide,
    //   uniforms: {
    //     uTime: { value: 0 },
    //     uPerlin: { value: null }
    //   }
    // });
    // this.texturedSunRund = new THREE.Mesh(sunRundGeo, rundSun);
    // this.texturedSunRund.position.set(position.x, position.y, position.z);
    // this.scene.add(this.texturedSunRund);

    // // 保存材质和场景，供外部访问
    // this.materialSun = materialSun;
    // this.materialnoise = materialnoise;
  }

  // 定义太阳的顶点着色器
  sunVertexTexture() {
    return `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vLayer0;
    varying vec3 vLayer1;
    varying vec3 vLayer2;
    varying vec3 eyeVector;
    varying vec3 vNormal;

    //旋转矩阵
    mat2 rotate(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c,-s,s,c);
    } 

    void main()
    {
        // uv坐标
        vUv = uv;
        // 顶点法线
        vNormal = normal;
        // 世界坐标系
        vec4 WorldPosition = modelMatrix * vec4 (position,1.0);
        // 顶点到相机的向量
        eyeVector = normalize(WorldPosition.xyz - cameraPosition);

        // 分别求围绕各个轴所进行的顶点旋转
        float t = uTime * 0.03;
        mat2 rot = rotate(t);

        vec3 p0 = position;
        p0.yz = rot * p0.yz;
        vLayer0 = p0;

        mat2 rot1 = rotate(t+10.0);
        vec3 p1 = position;
        p1.xz = rot1 * p1.xz;
        vLayer1 = p1;

        mat2 rot2 = rotate(t+30.0);
        vec3 p2 = position;
        p2.xy = rot2 * p2.xy;
        vLayer2 = p2; 

        vPosition = position;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;
  }

  // 定义太阳的片段着色器
  sunFragmentTexture() {
    return `
    uniform float uTime;
    varying vec2 vUv;
    uniform samplerCube uPerlin;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vLayer0;
    varying vec3 vLayer1;
    varying vec3 vLayer2;
    varying vec3 eyeVector;
    const float PI = 3.14159265359;

    vec3 brightnessToColor (float b){
      b *=0.25;
      return (vec3(b, b*b, b*b*b*b)/0.25)*0.7;
    }

    // 将各个图层的纹理叠加整合
    float sun(){
      float sum = 0.0;
      sum +=textureCube(uPerlin,vLayer0).r;
      sum +=textureCube(uPerlin,vLayer1).r;
      sum +=textureCube(uPerlin,vLayer2).r;
      sum *=0.40;
      return sum;
    }

    // 菲涅耳计算
    float Fresnel(vec3 eyeVector,vec3 worldNormal){
        return pow(1.3 + dot(eyeVector,worldNormal),4.0);
    }

    void main()
    {
      // 获取纹理
      float brightness = sun();
      // 增加对比度
      brightness = brightness*4.0+1.0;
      // 菲涅耳计算模拟反射和折射的光照
      float fres = Fresnel(eyeVector,vNormal);
      brightness += fres;
      // 获取太阳的颜色
      vec3 color = brightnessToColor(brightness); 
      gl_FragColor = vec4(color,1.0);
    }`;
  }

  // 定义噪声顶点着色器
  sunVertexShader() {
    return `
    varying vec3 vPosition;
    void main()
    {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;
  }

  // 定义噪声片段着色器
  sunFragmentShader() {
    return `
    precision highp float;

    // 修改后的 hash 函数，返回 vec2 类型
    vec2 hash(vec2 p)
    {
        p = vec2(
            dot(p, vec2(127.1, 311.7)),
            dot(p, vec2(269.5, 183.3))
        );
        return fract(sin(p) * 43758.5453);
    }

    // 噪声函数，使用新的 hash 函数
    float noise(vec2 p)
    {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;

        vec2 i = floor(p + (p.x + p.y) * K1);
        vec2 a = p - i + (i.x + i.y) * K2;

        vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0 * K2;

        // 计算三角形顶点的权重
        vec3 h = max(0.5 - vec3(
            dot(a, a), 
            dot(b, b), 
            dot(c, c)
        ), 0.0);

        // 计算噪声贡献
        vec3 n = h * h * h * h * vec3(
            dot(a, hash(i + vec2(0.0, 0.0))),
            dot(b, hash(i + o)),
            dot(c, hash(i + vec2(1.0, 1.0)))
        );

        return dot(n, vec3(70.0));
    }

    // 分形布朗运动（fbm）函数
    float fbm(vec2 p)
    {
        float sum = 0.0;
        float amp = 1.0;
        float scale = 1.0;
        for (int i = 0; i < 9; i++)
        {
            sum += noise(p * scale) * amp;
            p += 100.0;
            amp *= 0.8;
            scale *= 2.0;
        }
        return sum;
    }

    // 声明外部传入的变量
    uniform float uTime;
    varying vec3 vPosition;

    void main()
    {
        vec2 p = vPosition.xy * 0.7;
        float sunNoise = fbm(p + uTime * 0.1);
        gl_FragColor = vec4(vec3(sunNoise * 0.8), 1.0);
    }`;
  }

  // 定义太阳光晕的顶点着色器
  sunRundVertexTexture() {
    return `
    uniform float uTime;
    varying vec3 vPosition;

    void main()
    {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;
  }

  // 定义太阳光晕的片段着色器
  sunRundFragmentTexture() {
    return `
    varying vec3 vPosition;
    // 太阳色构建
    vec3 brightnessToColor (float b){
      b *=0.25;
      return (vec3(b, b*b, b*b*b*b)/0.25);
    }

    void main()
    {
      float d = mix(0.25, 0.0, vPosition.z);
      d = pow(d, 3.0);
      vec3 color = brightnessToColor(d);
      gl_FragColor = vec4(vec3(color), 1.0);
    }`;
  }

  // 更新函数，在动画循环中调用
  update(elapsedTime, renderer) {
    // 更新着色器中的 uTime
    this.materialSun.uniforms.uTime.value = elapsedTime;
    this.materialnoise.uniforms.uTime.value = elapsedTime;

    // 更新 cubeCamera
    this.cubeCamera.update(renderer, this.textureScene);

    // 设置 uPerlin 为渲染目标的纹理
    this.materialSun.uniforms.uPerlin.value = this.cubeRenderTarget.texture;
  }
}
