var container;
var scene, renderer, camera, controls;
var mouseX = 0, mouseY = 0;
var time = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var start = Date.now(); 

init();
animate();

function init() {
        
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);
    camera.position.set(0,100, 700);
    controls = new THREE.OrbitControls(camera);
    
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( {preserveDrawingBuffer: true} );
    renderer.setClearColor(0xffffff, 1.0)
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.physicallyBasedShading = true;
    
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );
    
    // var debrisMaterial = new THREE.MeshBasicMaterial({color:0xff0000});
    // var textureCube = createTexCube("tex/Cube/stripes/", ".png", true);
    var texture = createTex("tex/stripe.png");
    // console.log(textureCube);
    // textureCube.minFilter = THREE.NearestFilter;
    // textureCube.magFilter = THREE.NearestFilter;
    var shader = passThroughShader;
    // var debrisMaterial = new THREE.MeshBasicMaterial({map:texture});
    // var debrisMaterial = new THREE.ShaderMaterial({
    //     uniforms: shader.uniforms,
    //     vertexShader: shader.vertexShader,
    //     fragmentShader: shader.fragmentShader,
    //     transparent: true
    // })
    // debrisMaterial.uniforms.texture.value = texture;
    // loadModel("obj/debris.obj", debrisMaterial );
    var cubeGeo = new THREE.BoxGeometry(50,50,50);

    for(var i = 0; i < window.innerWidth*5; i+=window.innerWidth/20){
        for(var j = 0; j < window.innerHeight*5; j+=window.innerHeight/10){
            var debrisMaterial = new THREE.ShaderMaterial({
                uniforms: shader.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader,
                transparent: true
            })
            debrisMaterial.uniforms.texture.value = texture;
            debrisMaterial.uniforms.color.value = new THREE.Vector3(Math.random()*2 -1,Math.random()*2 -1, Math.random()*2 -1);
            var cube = new THREE.Mesh(cubeGeo,debrisMaterial);
            cube.position.y = 50;
            cube.position.z = j-window.innerHeight*5/2;
            cube.position.x = i-window.innerWidth*5/2;
            scene.add(cube);
        }
    }
    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'keydown', function(){screenshot(renderer)}, false );
    // window.addEventListener( 'resize', onWindowResize, false );
    
}
function animate(){
	window.requestAnimationFrame(animate);
	draw();
}
function draw(){
    time+=0.01;
    // camera.lookAt(new THREE.Vector3(0,0,0));
    // camera.position.x += Math.sin(time);
    // camera.position.z += Math.cos(time);
	renderer.render(scene, camera);
}