import * as THREE from 'three';
import '../vendor/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import $ from 'jquery';

export default class Background3d {

    constructor(container, count) {

        this.container = container;
        this.options = {};
        this.options.count = count || 10;
        this.cubes = [];

        this.clock = new THREE.Clock();
        this.uniforms = {
            "time": { value: 1.0 }
        };

        this.init();
    }

    init() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 40;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xE8E9F3, 0)

        this.light = new THREE.HemisphereLight('#fff', '#ababab', 1);
     
      
        this.scene.add(this.light);
 

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.container.append(this.renderer.domElement);

        this.addElements();


        window.addEventListener('resize', ()=>{ this.onWindowResize() }, false);

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
  

        this.animate();

    }


    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    addElements() {


        for (let i = 0; i <= this.options.count; i++) {

            this.cubes.push(this.createCube());

        }

    }


    moveX(y) {


        for (let i = 0; i <= this.cubes.length - 1; i++) {

            this.cubes[i].rotation.y += (y * .002);

        }

    }


    createCube() {
        let cube = new THREE.BoxBufferGeometry(20, 20, 20);
        

        let shaderMaterial = new THREE.ShaderMaterial({
            uniforms : this.uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        }); 

        let basicMaterial = new THREE.MeshLambertMaterial({
            color : '#2570fa'
        });

        let mesh1 = new THREE.Mesh(cube, basicMaterial);
       
        let thresholdX = window.innerWidth * .1,
            thresholdY = window.innerHeight * .1;

        let posX = (Math.random() * 1 >= .5 ? Math.random() * thresholdX : -(Math.random() * thresholdX)),
            posY = (Math.random() * 1 >= .5 ? Math.random() * thresholdY : -(Math.random() * thresholdY)),
            posZ = -((Math.random() * 400) + 50);

        mesh1.position.x = posX;
        mesh1.position.z = posZ;
        mesh1.position.y = posY; 


        mesh1.rotation.x = Math.random() * 360;

        this.scene.add(mesh1);

        return mesh1;

    }


    animate() {

        let delta = this.clock.getDelta();


        this.controls.update();
        this.composer.render();

        this.uniforms[ "time" ].value += delta;


        this.cubes.forEach(cube=>{
            cube.rotation.z += .005;
        })

        window.requestAnimationFrame(() => {
            this.animate();
        });


    }

}