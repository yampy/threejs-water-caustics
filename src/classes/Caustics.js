import * as THREE from 'three';
import vertexShader from '../shaders/caustics/vertex.glsl';
import fragmentShader from '../shaders/caustics/fragment.glsl';

class Caustics {
    constructor(lightFrontGeometry, uLight) {
        this._camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 2000);
        this._geometry = lightFrontGeometry;
        this.texture = new THREE.WebGLRenderTarget(1024, 1024, {type: THREE.UnsignedByteType});
        this.clearColor = new THREE.Color('black')

        const material = new THREE.RawShaderMaterial({
            uniforms: {
                light: { value: uLight },
                water: { value: null },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            extensions: {
                derivatives: true,
            }
        });
        this._causticMesh = new THREE.Mesh(this._geometry, material);
    }
    
    // Update caustics with simulated waterTexture
    update(renderer, waterTexture){        
        this._causticMesh.material.uniforms['water'].value = waterTexture;

        renderer.setRenderTarget(this.texture);
        renderer.setClearColor(this.clearColor, 1);
        renderer.clear();

        renderer.render(this._causticMesh, this._camera);
    }

}

export default Caustics;