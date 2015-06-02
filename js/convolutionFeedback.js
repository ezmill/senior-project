var convolutionFb = null;
function initConvolutionFeedback(event){
    event.preventDefault();
    if(convolutionFb == null){
        document.getElementById("convolutionFeedback").children[0].style.display = "none";       
        convolutionFb = new ConvolutionFeedback();
        convolutionFb.init();
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        convolutionFbAnimate();
    } else {
        return;
    }

}
function convolutionFbAnimate(){
    window.requestAnimationFrame(convolutionFbAnimate);
    convolutionFb.draw();
}

function ConvolutionFeedback(){
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
        // controls = new THREE.OrbitControls(camera);
        this.cameraRTT = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
        this.cameraRTT.position.z = 100;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( {preserveDrawingBuffer: true} );
        this.renderer.setClearColor(0xffffff, 1.0)
        this.renderer.setSize( 750, 400 );
        
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.physicallyBasedShading = true;
        
        this.container = document.getElementById( 'convolutionFeedback' );
        this.container.appendChild( this.renderer.domElement );

        var inputTexture = THREE.ImageUtils.loadTexture("tex/clouds.jpg");

        var geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);

        var blurKernel = [
            1.0,1.0,1.0,
            1.0,1.0,1.0,
            1.0,1.0,1.0
        ]
        var identityKernel = [
            0.0,0.0,0.0,
            0.0,1.0,0.0,
            0.0,0.0,0.0
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
            blurKernel[i] *= 100.25;
            // sharpenKernel[i] /= 0.25;
        }
        this.rtt1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.rtt2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.rtt1.minFilter = this.rtt2.minFilter = THREE.NearestFilter;
        this.rtt1.magFilter = this.rtt2.magFilter = THREE.NearestFilter;

        this.s1 = new THREE.Scene();
        this.s2 = new THREE.Scene();

        this.mat1 = new THREE.ShaderMaterial({
            uniforms: convolutionShader.uniforms,
            vertexShader: convolutionShader.vertexShader,
            fragmentShader: convolutionShader.fragmentShader
        });
        this.mat1.uniforms["texture"].value = inputTexture;
        this.mat1.uniforms["kernel"].value = blurKernel;
        this.mat1.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);



        this.mat2 = this.mat1.clone();
        this.mat2.uniforms["texture"].value = this.rtt1;
        this.mat2.uniforms["kernel"].value = blurKernel;
        this.mat2.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);

        this.mesh1 = new THREE.Mesh(geometry, this.mat1);
        this.s1.add(this.mesh1);
        this.mesh2 = new THREE.Mesh(geometry, this.mat2);
        this.s2.add(this.mesh2);

        var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map:this.rtt2}));
        this.scene.add(mesh);
    }
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