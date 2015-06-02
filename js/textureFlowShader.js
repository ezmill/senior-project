var textureFlowShader =  {

    uniforms: THREE.UniformsUtils.merge( [

        {
            "texture"  : { type: "t", value: null },
            "mouse"  : { type: "v2", value: null },
            "resolution"  : { type: "v2", value: null },
            "time"  : { type: "f", value: null }

        }
    ] ),

    vertexShader: [

        "varying vec2 vUv;",
        "void main() {",
        "    vUv = uv;",
        "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    
    ].join("\n"),
    
    fragmentShader: [
        
        "uniform vec2 resolution;",
        "uniform float time;",
        "uniform sampler2D texture;",
        "varying vec2 vUv;",
        "uniform vec2 mouse;",

        "void main( void ){",
        "    vec2 uv = vUv;",

        "    vec2 e = 1.0/resolution.xy;",


        "    float am1 = 0.5 + 0.5*0.927180409;",
        "    float am2 = 10.0;",

        "    for( int i=0; i<20; i++ ){",
        "       float h  = dot( texture2D(texture, uv*0.99,               -100.0).xyz, vec3(0.333) );",
        "       float h1 = dot( texture2D(texture, uv+vec2(e.x,mouse.x), -100.0).xyz, vec3(0.333) );",
        "       float h2 = dot( texture2D(texture, uv+vec2(mouse.y,e.y), -100.0).xyz, vec3(0.333) );",
        "       vec2 g = 0.001*vec2( (h1-h), (h2-h) )/e;",
        "       vec2 f = g.yx*vec2(3.0*mouse.x, 3.0*mouse.y);",

        "       g = mix( g, f, am1 );",

        "       uv += 0.00005*g*am2;",
        "    }",

        "    vec3 col = texture2D(texture, uv).xyz;",
        "    gl_FragColor = vec4(col, 1.0);",
        "}"
    
    ].join("\n")
    
}