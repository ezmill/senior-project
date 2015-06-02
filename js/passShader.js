var passShader =  {

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
        
        "uniform sampler2D texture; ",
        "varying vec2 vUv;",

        "void main() {",
        "    gl_FragColor = texture2D(texture, vUv);",
        "}"
    
    ].join("\n")
    
}
