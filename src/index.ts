import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 흰색 조명, 강도 1
directionalLight.position.set(5, 10, 7.5); // 조명의 위치 설정
directionalLight.castShadow = true; // 그림자 생성 (필요시)
scene.add(directionalLight);

// 헬멧의 후면을 밝히는 추가적인 방향성 조명
const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(-10, 10, -10); // 헬멧의 후면에서 빛을 비추도록 위치 설정
scene.add(backLight);

camera.position.z = 5;


const SkyBoxLoader = new THREE.CubeTextureLoader();
SkyBoxLoader.setPath('src/assets/skybox/');

const envMap = SkyBoxLoader.load([
    'right.jpg',
    'left.jpg',
    'top.jpg',
    'bottom.jpg',
    'front.jpg',
    'back.jpg'
],()=>{
    console.log('Load 성공 (네트워크 확인)')
},undefined,
(error)=>{
    console.error('error occurred while load cubemap!',error);
}
);

scene.background = envMap;
scene.environment = envMap;

const GlTFloader = new GLTFLoader();

let model : THREE.Group<THREE.Object3DEventMap> | null = null;

GlTFloader.load(
    'src/assets/DamagedHelmet.glb',
    (gltf)=>{
        model = gltf.scene;
        model.traverse((node)=>{
            if(node instanceof THREE.Mesh){
                node.material.envMap = envMap;
                node.material.envMapIntensity = 1.0;
                node.material.needsUpdate = true;
            }
        })
        scene.add(model);
    },
    undefined,
    (error)=>{
        console.error('error occurred! while loading gltf model');
    }
);


function animate() {
    if(model){
        model.rotation.y += 0.01;
    }
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
