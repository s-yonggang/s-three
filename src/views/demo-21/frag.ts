const fragmentShaderReplacements = [
  {
    from: '#include <common>',
    to: `
      #include <common>
      uniform sampler2D indexTexture;
      uniform sampler2D paletteTexture;
      uniform float paletteTextureWidth;
    `,
  },
  {
    from: '#include <color_fragment>',
    to: `
      #include <color_fragment>
      {
        vec4 indexColor = texture2D(indexTexture, vMapUv);
        float index = indexColor.r * 255.0 + indexColor.g * 255.0 * 256.0;
        vec2 paletteUV = vec2((index + 0.5) / paletteTextureWidth, 0.5);
        vec4 paletteColor = texture2D(paletteTexture, paletteUV);
        // diffuseColor.rgb += paletteColor.rgb;   // white outlines
        diffuseColor.rgb = paletteColor.rgb - diffuseColor.rgb;  // black outlines
      }
    `,
  },
];

export { fragmentShaderReplacements };
