var textureFlowOGShader =  {

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

        "void main()",
        "{",
        "    ",
        "    vec2 uv = vUv;",
        "    ",
        "    vec2 e = 1.0/resolution.xy;",
        "    ",
        "    ",
        "    float am1 = 0.5 + 0.5*sin( time );",
        "    float am2 = 0.5 + 0.5*cos( time );",
        "    ",
        "    for( int i=0; i<20; i++ )",
        "    {",
        "        float h  = dot( texture2D(texture, uv,               -100.0).xyz, vec3(0.333) );",
        "        float h1 = dot( texture2D(texture, uv+vec2(e.x,0.0), -100.0).xyz, vec3(0.333) );",
        "        float h2 = dot( texture2D(texture, uv+vec2(0.0,e.y), -100.0).xyz, vec3(0.333) );",
        "        // gradient",
        "        vec2 g = 0.001*vec2( (h1-h), (h2-h) )/e;",
        "        // isoline      ",
        "        vec2 f = g.yx*vec2(-1.0,1.0);",
        "        ",
        "        g = mix( g, f, am1 );",
        "        ",
        "        uv += 0.01*g*am2;",
        "    }",
        "    ",
        "    vec3 col = texture2D(texture, uv).xyz;",
        "    ",
        // "    col *= 2.0;",
        "        ",
        "    gl_FragColor = vec4(col, 1.0);",
        "}"

    
    ].join("\n")
    
}