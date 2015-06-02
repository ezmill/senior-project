var simple = null;
function initSimpleCube(event){
    event.preventDefault();
    if(simple == null){
        document.getElementById("simpleCube").children[0].style.display = "none";       
        simple = new SimpleCube();
        simple.init();
        simpleAnimate();
    } else {
        return;
    }

}
function simpleAnimate(){
    window.requestAnimationFrame(simpleAnimate);
    simple.draw();
}

function SimpleCube(){
    this.container, this.scene, this.renderer, this.camera, this.controls;
    this.mesh;
    this.animate, this.init, this.draw, this.mouseHandler;
    this.init = function(){
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);
        this.camera.position.set(0,0, 3);
        // this.controls = new THREE.OrbitControls(this.camera);

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( {preserveDrawingBuffer: true} );
        this.renderer.setClearColor(0xffffff, 1.0)
        this.renderer.setSize( 750, 400 );
        
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.physicallyBasedShading = true;
        
        this.container = document.getElementById( 'simpleCube' );
        this.container.appendChild( this.renderer.domElement );
        var geometry = new THREE.BoxGeometry(1,1,1);
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xff0000}));
        this.scene.add(this.mesh);

        this.light = new THREE.DirectionalLight(0xffffff, 1.0);
        this.light.position.set(0,2,3);
        this.scene.add(this.light);
    }
    this.draw = function(){
        this.renderer.render(this.scene, this.camera);
        this.mesh.rotation.x = Date.now()*0.001;
        this.mesh.rotation.y = Date.now()*0.005;
    }
}