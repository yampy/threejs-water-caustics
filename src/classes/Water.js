import * as THREE from 'three';
import vertexShader from '../shaders/water/vertex.glsl';
import fragmentShader from '../shaders/water/fragment.glsl';

class Water {
    constructor(uLight, uTile, uSky) {
        console.log("Water Class constructed!");
        this.geometry = new THREE.PlaneBufferGeometry(2, 2, 800, 800);

        this.material = new THREE.RawShaderMaterial({
            uniforms: {
                light: { value: uLight},
                tiles: { value: uTile},
                sky: { value: uSky},
                water: { value: null},
                causticTex: { value: null},
                underwater: { value: false},
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    draw(renderer, waterTexture, causticsTexture, camera) {
        this.material.uniforms['water'].value = waterTexture;
        this.material.uniforms['causticTex'].value = causticsTexture;
        this.material.side = THREE.FrontSide;
        this.material.uniforms['underwater'].value = true;
        renderer.render(this.mesh, camera);

        this.material.side = THREE.BackSide;
        this.material.uniforms['underwater'].value = false;
        renderer.render(this.mesh, camera);
    }
}

export default Water;