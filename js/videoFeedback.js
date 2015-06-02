var videoFeedback;
function initTextureFlow(event){
    event.preventDefault();
    videoFeedback = new VideoFeedback();
    videoFeedback.init();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    vfAnimate();
}
function vfAnimate(){
    window.requestAnimationFrame(vfAnimate);
    videoFeedback.draw();
}

function VideoFeedback(){
    this.container, this.scene, this.renderer, this.camera, this.cameraRTT, this.controls;
    this.mouseX = 0, this.mouseY = 0;
    this.rtt1, this.rtt2;
    this.s1, this.s2;
    this.mat1, this.mat2;
    this.mesh1, this.mesh2;
    this.inc = 0, this.addFrames = true;
    this.animate, this.init, this.draw, this.mouseHandler;
    this.init = function(){
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);
        this.camera.position.set(0,0, 10);
        this.controls = new THREE.OrbitControls(camera);
        this.cameraRTT = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
        this.cameraRTT.position.z = 100;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( {preserveDrawingBuffer: true} );
        this.renderer.setClearColor(0xffffff, 1.0)
        this.renderer.setSize( 750, 400 );
        
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.physicallyBasedShading = true;
        
        this.container = document.getElementById( 'videoFeedback' );
        this.container.appendChild( this.renderer.domElement );

        var inputTexture = THREE.ImageUtils.loadTexture("tex/clouds.jpg");

        var geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);

        this.rtt1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.rtt2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.rtt1.minFilter = this.rtt2.minFilter = THREE.NearestFilter;
        this.rtt1.magFilter = this.rtt2.magFilter = THREE.NearestFilter;

        this.s1 = new THREE.Scene();
        this.s2 = new THREE.Scene();

        this.mat1 = new THREE.ShaderMaterial({
            uniforms: passShader.uniforms,
            vertexShader: passShader.vertexShader,
            fragmentShader: passShader.fragmentShader
        });
        this.mat1.uniforms["texture"].value = inputTexture;
        this.mat1.uniforms["mouse"].value = new THREE.Vector2(this.mouseX, this.mouseY);
        this.mat1.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);

        this.mat2 = new THREE.ShaderMaterial({
            uniforms: textureFlowShader.uniforms,
            vertexShader: textureFlowShader.vertexShader,
            fragmentShader: textureFlowShader.fragmentShader
        });
        this.mat2.uniforms["texture"].value = this.rtt1;
        this.mat2.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);

        this.mesh1 = new THREE.Mesh(geometry, this.mat1);
        this.s1.add(this.mesh1);
        this.mesh2 = new THREE.Mesh(geometry, this.mat2);
        this.s2.add(this.mesh2);

        var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map:this.rtt2}));
        this.scene.add(mesh);

        // document.addEventListener( 'keydown', function(){screenshot(renderer)}, false );        
    }

    // var animate = function(){
    //     window.requestAnimationFrame(animate);
    //     this.draw();
    // }
    this.draw = function(){
        this.mat2.uniforms["texture"].value = this.rtt1;
        this.inc++
        if(this.inc >= 10){
            this.addFrames = false;
        }
        if(this.addFrames){
            this.renderer.render(this.s1, this.cameraRTT, this.rtt1, true);
        }
        this.renderer.render(this.s2, this.cameraRTT, this.rtt2, true);
        this.renderer.render(this.scene, this.cameraRTT);

        var a = this.rtt2;
        this.rtt2 = this.rtt1;
        this.rtt1 = a;
    }
}
// function onDocumentMouseMove(){
//     unMappedMouseX = (event.clientX );
//     unMappedMouseY = (event.clientY );
//     textureFlow.mouseX = map(unMappedMouseX, window.innerWidth, -1.0,1.0);
//     textureFlow.mouseY = map(unMappedMouseY, window.innerHeight, -1.0,1.0);

//     textureFlow.mat1.uniforms["mouse"].value = new THREE.Vector2(textureFlow.mouseX, textureFlow.mouseY);    
//     textureFlow.mat2.uniforms["mouse"].value = new THREE.Vector2(textureFlow.mouseX, textureFlow.mouseY);  
// }