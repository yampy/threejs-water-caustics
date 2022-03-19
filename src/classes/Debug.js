import * as THREE from 'three';
import vertexShader from '../shaders/debug/vertex.glsl';
import fragmentShader from '../shaders/debug/fragment.glsl';

class Debug {
    constructor() {
        this._camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1);
        this._geometry = new THREE.PlaneBufferGeometry(2, 2, 200, 200);

        this._material = new THREE.RawShaderMaterial({
            uniforms: {
                texture: { value: null },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        this._mesh = new THREE.Mesh(this._geometry, this._material);
    }

    draw(renderer, texture) {
        this._material.uniforms['texture'].value = texture;

        renderer.setRenderTarget(null);
        renderer.render(this._mesh, this._camera);
    }

}

export default Debug;