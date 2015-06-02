var container;
var scene, renderer, camera, cameraRTT, controls;
var mouseX = 0, mouseY = 0;
var time = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var start = Date.now(); 

var rtt1, rtt2;
var s1, s2;
var mat1, mat2;
var mesh1, mesh2;
var inc = 0, addFrames = true;;
init();
animate();

function init() {
        
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);
    camera.position.set(0,0, 10);
    // controls = new THREE.OrbitControls(camera);
    cameraRTT = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    cameraRTT.position.z = 100;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( {preserveDrawingBuffer: true} );
    renderer.setClearColor(0xffffff, 1.0)
    renderer.setSize( 750, 400 );
    
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.physicallyBasedShading = true;
    
    container = document.getElementById( 'convolution' );
    container.appendChild( renderer.domElement );


    var blurKernel = [
        1.0,1.0,1.0,
        1.0,1.0,1.0,
        1.0,1.0,1.0
    ]
    var sharpenKernel = [
        0.0,-1.0,0.0,
        -1.0,5.0,-1.0,
        0.0,-1.0,0.0
    ]
    var embossKernel = [
        -2.0, -1.0, 0.0,
        -1.0, 1.0, 1.0,
        0.0, 1.0, 2.0
    ]
    var edgeDetectKernel = [
        0.0,1.0,0.0,
        1.0,-4.0,1.0,
        0.0,1.0,0.0
    ]
    for(var i=0; i<blurKernel.length; i++) {
        blurKernel[i] *= 0.25;
        sharpenKernel[i] /= 0.25;
    }

    var inputTexture = THREE.ImageUtils.loadTexture("tex/clouds.jpg");

    var geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);

    rtt1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    rtt2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    rtt1.minFilter = rtt2.minFilter = THREE.NearestFilter;
    rtt1.magFilter = rtt2.magFilter = THREE.NearestFilter;

    s1 = new THREE.Scene();
    s2 = new THREE.Scene();

    mat1 = new THREE.ShaderMaterial({
        uniforms: convolutionShader.uniforms,
        vertexShader: convolutionShader.vertexShader,
        fragmentShader: convolutionShader.fragmentShader
    });
    mat1.uniforms["texture"].value = inputTexture;
    mat1.uniforms["kernel"].value = blurKernel;
    mat1.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);

    mat2 = mat1.clone();
    mat2.uniforms["texture"].value = rtt1;
    mat2.uniforms["kernel"].value = sharpenKernel;
    mat2.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);

    mesh1 = new THREE.Mesh(geometry, mat1);
    s1.add(mesh1);
    mesh2 = new THREE.Mesh(geometry, mat2);
    s2.add(mesh2);

    var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map:rtt2}));
    scene.add(mesh);

    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'keydown', function(){screenshot(renderer)}, false );
    // window.addEventListener( 'resize', onWindowResize, false );
    
}
function animate(){
	window.requestAnimationFrame(animate);
	draw();
}
function draw(){

    mat2.uniforms["texture"].value = rtt1;

    inc++
    if(inc >= 10){
        addFrames = false;
    }
    if(addFrames){
        renderer.render(s1, cameraRTT, rtt1, true);
    }
    renderer.render(s2, cameraRTT, rtt2, true);
	renderer.render(scene, cameraRTT);

    var a = rtt2;
    rtt2 = rtt1;
    rtt1 = a;

}