import vertexShader from '../shaders/simulation/vertex.glsl';
import dropFragmentShader from '../shaders/simulation/drop_fragment.glsl';
import normalFragmentShader from '../shaders/simulation/normal_fragment.glsl';
import updateFragmentShader from '../shaders/simulation/update_fragment.glsl';
import * as THREE from 'three'

class WaterSimulation {
    constructor() {
        console.log("WaterSimlation Class constructed!");
        this._camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 2000);
        this._geometry = new THREE.PlaneBufferGeometry(3, 3, 400, 400);
        this._textureA = new THREE.WebGLRenderTarget(512, 512, {type: THREE.FloatType});
        this._textureB = new THREE.WebGLRenderTarget(512, 512, {type: THREE.FloatType});
        this.texture = this._textureA;        
        
        const dropMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                center: { value: [0, 0] },
                radius: { value: 0 },
                strength: { value: 0 },
                texture: { value: null },
            },
            vertexShader: vertexShader,
            fragmentShader: dropFragmentShader,
        });

        const normalMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                delta: { value: [1 / 256, 1 / 256] },
                texture: { value: null},
            },
            vertexShader: vertexShader,
            fragmentShader: normalFragmentShader,
        });

        const updateMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                delta: { value: [1 / 256, 1 / 256] },
                texture: { value: null},
            },
            vertexShader: vertexShader,
            fragmentShader: updateFragmentShader,
        });

        this._dropMesh = new THREE.Mesh(this._geometry, dropMaterial);
        this._normalMesh = new THREE.Mesh(this._geometry, normalMaterial);
        this._updateMesh = new THREE.Mesh(this._geometry, updateMaterial);
    }

    // add a drop of water at xy position
    addDrop(renderer, x, y, radius, strength){
        this._dropMesh.material.uniforms['center'].value = [x, y];
        this._dropMesh.material.uniforms['radius'].value = radius;
        this._dropMesh.material.uniforms['strength'].value = strength;

        this._render(renderer, this._dropMesh);
    }

    stepSimulation(renderer) {
        this._render(renderer, this._updateMesh);
    }

    updateNormals(renderer) {
        this._render(renderer, this._normalMesh);
    }

    _render(renderer, mesh) {

        const oldTexture = this.texture;
        const newTexture = this.texture === this._textureA ? this._textureB : this._textureA;
    
        mesh.material.uniforms['texture'].value = oldTexture.texture;

        renderer.setRenderTarget(newTexture);

        renderer.render(mesh, this._camera);

        this.texture = newTexture;
    }

}

export default WaterSimulation;