import * as THREE from 'three';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls'
import 'normalize.css';
import utils from './shaders/utils.glsl';
import WaterSimulation from './classes/WaterSimulation';
import Water from './classes/Water';
import Caustics from './classes/Caustics';

// DOM variables
const canvas  = document.getElementById('webGLContainer')
const black = new THREE.Color('black');
const white = new THREE.Color('white');
const width = window.innerWidth;
const height =  window.innerHeight;

// Setup Three.js Scene
let camera, scene, renderer, controls;
let uniforms, material, mesh;
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

// Setup Raycastering for Intersect calculation
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const targetGeometry = new THREE.PlaneBufferGeometry(2, 2);
for (let index = 0; index < targetGeometry.attributes.position.count; index++) {
    // Transform plane geometry position from X-Y into X-Z
    let posy = targetGeometry.attributes.position.getY(index);
    targetGeometry.attributes.position.getY(index);
    targetGeometry.attributes.position.setZ(index, -posy);
    targetGeometry.attributes.position.setY(index, 0.0);
    let posz = targetGeometry.attributes.position.getZ(index)
}
const targetMesh = new THREE.Mesh(targetGeometry);

// Shader Classes
let waterSimulation, water, caustics;
const uLight = [0.3, 0.3, -0.3];
const uTile = textureLoader.load('./assets/tile/tiles.jpg');
const uSky = cubeTextureLoader.load([
        './assets/sky/xpos.jpg',
        './assets/sky/xneg.jpg',
        './assets/sky/ypos.jpg',
        './assets/sky/ypos.jpg',
        './assets/sky/zpos.jpg',
        './assets/sky/zneg.jpg',
    ]);
    
function init() {
    // Set utils.glsl to ShaderChunk
    THREE.ShaderChunk['utils'] = utils;

    // Setup Renderer
    // Use WebGL1Renderer because of fragment shader for caustics uses GL_OES_standard_derivatives GLSL extention.
    renderer = new THREE.WebGL1Renderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    renderer.setSize(width, height);
    renderer.autoClear = false;

    // Setup Camera
    camera = new THREE.PerspectiveCamera(50, width / height, 0.001, 100);    
    camera.position.set(0, 4, 0);
    camera.lookAt(0, 0, 0);

    controls = new TrackballControls(
        camera, canvas
    );
    controls.screen.width = width;
    controls.screen.height = height;

    // Setup Scene
    scene = new THREE.Scene();
    
    // Setup Shader Classes
    waterSimulation = new WaterSimulation();
    water = new Water(uLight, uTile, uSky);
    caustics = new Caustics(water.geometry, uLight);

    // Add Event Listner
    window.addEventListener('resize', onResize, false);
    canvas.addEventListener('mousemove', {handleEvent: onMouseMove });

    
    // Add Initial Drops
    for(let i =0;i < 3; i++) {
        waterSimulation.addDrop(
            renderer,
            Math.random() * 2 - 1, Math.random() * 2 - 1,  // set random position
            0.05, 
            (i & 1) ? 0.02: -0.02
        );
    }
}

function onResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
}

function onMouseMove(event){
    // Set mouse position from -1 to 1
    const rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) * 2 / width - 1;
    mouse.y = - (event.clientY - rect.top) * 2 / height + 1;

    // Calculate intersects and drops
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(targetMesh);

    for(let intersect of intersects) {
        console.log("intersect!", intersect);
        waterSimulation.addDrop(
            renderer,
            intersect.point.x,
            intersect.point.z,
            0.10, // radius
            0.01  // strength
        );
    }
}

function render(){
    // Surface water wave simulation
    waterSimulation.stepSimulation(renderer);
    waterSimulation.updateNormals(renderer);
    const waterTexture = waterSimulation.texture.texture;

    // Caustic simulation using water surface
    caustics.update(renderer, waterTexture)
    const causticsTexture = caustics.texture.texture;    

    // Water color 
    water.draw(renderer, waterTexture, causticsTexture, camera);

    renderer.setClearColor( new THREE.Color('black'), 1.0);
    controls.update();
    window.requestAnimationFrame(render);
}

init();
render();