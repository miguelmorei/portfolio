import * as THREE from 'three';
import $ from 'jquery';

export default class Background3d {

    constructor(container){
     
        this.container = container;
        this.init();
    }

    init () {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.z = 400;
        
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor(0xffffff)


        this.container.append(this.renderer.domElement);

        this.addElements();

        
		window.addEventListener( 'resize', this.onWindowResize, false );

    }

    
    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );

    }

    addElements() {

        let cube = new THREE.BoxGeometry(200, 200, 200);
        let material = new THREE.MeshBasicMaterial();

        let mesh = new THREE.Mesh(cube, material);

        this.scene.add(mesh);

    }

}