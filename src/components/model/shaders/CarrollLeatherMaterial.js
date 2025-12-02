import * as THREE from 'three';

/**
 * Creates a Carroll Leather material - authentic, premium leather with natural characteristics
 */
export const createCarrollLeatherMaterial = (fabricColor, stitchColor, textures, ambientStrength = 0.5, specularPower = 18.0, specularIntensity = 0.35, isTwoTone = false, noStitching = false, externalStitchColor = null) => {
  // ✅ Load fine-grain procedural bump texture for extra realism
  const leatherGrainTexture = new THREE.TextureLoader().load('/assets/fabrics/CarrollLeather.png');
  leatherGrainTexture.wrapS = leatherGrainTexture.wrapT = THREE.RepeatWrapping;
  leatherGrainTexture.anisotropy = 8;

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  const fragmentShader = `
    uniform sampler2D aoMap;
    uniform sampler2D diamondNormalMap;
    uniform sampler2D stitchMap;
    uniform sampler2D externalStitchMap; // External stitchings
    uniform sampler2D grainMap; // ✅ New fine-grain bump map
    uniform vec3 fabricColor;
    uniform vec3 stitchColor;
    uniform vec3 externalStitchColor;
    uniform float ambientStrength;
    uniform float specularPower;
    uniform float specularIntensity;
    uniform bool uIsTwoTone;
    uniform bool uNoStitching;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    // Realistic natural leather texture - no grid patterns
    float naturalLeatherGrain(vec2 uv) {
      // Use continuous noise instead of grid-based patterns
      vec2 p = uv * 100.0; // Scale for leather grain detail
      
      // Multi-octave noise for organic leather texture
      float noise = 0.0;
      float amplitude = 1.0;
      float frequency = 1.0;
      
      for(int i = 0; i < 4; i++) {
        // Organic noise using sine waves with different phases
        float n1 = sin(p.x * frequency + sin(p.y * frequency * 1.3) * 0.5) * 0.5 + 0.5;
        float n2 = sin(p.y * frequency * 1.1 + sin(p.x * frequency * 0.8) * 0.7) * 0.5 + 0.5;
        float n3 = sin((p.x + p.y) * frequency * 0.7) * 0.5 + 0.5;
        
        // Combine and add to noise
        noise += (n1 + n2 + n3) / 3.0 * amplitude;
        
        amplitude *= 0.5;
        frequency *= 2.0;
        p *= 1.3; // Slight rotation for each octave
      }
      
      // Normalize and add some sharpness for leather pebbles
      noise = noise / 2.0; // Normalize
      noise = pow(noise, 0.8); // Add some contrast
      
      return noise;
    }
    
    void main() {
      // Base Carroll leather color
      vec3 baseLeatherColor = fabricColor;
      
      // Generate organic leather texture - no repetitive patterns
      float grain = naturalLeatherGrain(vUv);

      // ✅ Blend in procedural grain texture for realistic bumpiness
      vec3 grainSample = texture2D(grainMap, vUv * 30.0).rgb;
      float fineGrain = dot(grainSample, vec3(0.333));
      grain = mix(grain, fineGrain, 0.6); // blend strength controls realism
      
      // Create natural leather variation
      vec3 naturalLeather = baseLeatherColor * (0.8 + 0.2 * grain);
      
      // Add subtle darker areas for depth (leather valleys)
      float darkness = 1.0 - grain;
      naturalLeather = mix(naturalLeather, baseLeatherColor * 0.7, darkness * 0.15);
      
      // Enhanced natural leather lighting - matches reference contrast
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      
      // Natural leather lighting with organic grain variation
      float NdotL = max(dot(normal, lightDir), 0.0);
      float grainLighting = 0.85 + 0.15 * grain; // Subtle grain-based lighting
      vec3 diffuse = naturalLeather * NdotL * grainLighting * 0.8;
      
      // Warm ambient for natural leather feel (dynamically adjusted)
      vec3 ambient = naturalLeather * ambientStrength;
      
      // Apply dark color visibility boost BEFORE adding specular
      float fabricLuminance = dot(baseLeatherColor, vec3(0.299, 0.587, 0.114));
      float darkBoost = 1.0;
      if (fabricLuminance < 0.15) {
        darkBoost = 1.0 + (0.15 - fabricLuminance) * 3.0;
      }
      
      vec3 boostedDiffuse = (ambient + diffuse) * darkBoost;
      
      // Material-specific specular (Carroll leather natural shine)
      vec3 reflectDir = reflect(-lightDir, normal);
      float specPower = specularPower + 8.0 * grain;
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), specPower);
      vec3 specular = vec3(specularIntensity) * spec * (0.7 + 0.3 * grain);
      
      vec3 leatherBase = boostedDiffuse + specular;
      
      // Apply AO with natural leather characteristics
      // In single-tone mode, flip Y for correct orientation; in two-tone, use direct UVs
      float aoY = uIsTwoTone ? ( vUv.y) : ( vUv.y);
      vec2 aoUV = vec2(vUv.x, aoY);
      vec4 aoSample = texture2D(aoMap, aoUV);
      float aoIntensity = aoSample.r;
      vec3 afterAO = leatherBase * mix(0.5, 1.0, aoIntensity);
      
      // Apply Dynamic Pattern layer (pattern overlay) - skip if noStitching is true
      vec3 afterDiamond = afterAO;
      
      if (!uNoStitching) {
        // In single-tone mode, flip Y for correct orientation; in two-tone, use direct UVs
        float diamondY = uIsTwoTone ? vUv.y : ( vUv.y);
        vec2 diamondUV = vec2(vUv.x, diamondY);
        vec4 diamondSample = texture2D(diamondNormalMap, diamondUV);
        
        // Extract brightness for mask
        float diamondLuminance = dot(diamondSample.rgb, vec3(0.299, 0.587, 0.114));
        
        // Invert so darker areas represent pattern lines
        float diamondMask = 1.0 - diamondLuminance;
        
        // Darken fabric color based on pattern (with visibility boost for dark colors)
        float darkFactor = 0.4;
        if (fabricLuminance < 0.15) {
          darkFactor = 0.5 + (0.15 - fabricLuminance) * 0.8;
        }
        vec3 darkenedFabric = fabricColor * darkFactor;
        
        // Blend between base material and darkened pattern
        afterDiamond = mix(afterAO, darkenedFabric, diamondMask * 0.9);
      }
      
      // Apply stitching
      vec3 finalResult = afterDiamond;
      
      if (!uNoStitching) {
        // In single-tone mode, flip Y for correct orientation; in two-tone, use direct UVs
        float stitchY = uIsTwoTone ? vUv.y : ( vUv.y);
        vec2 stitchUV = vec2(vUv.x, stitchY);
        vec4 stitchSample = texture2D(stitchMap, stitchUV);
        
        float stitchAlpha = stitchSample.a;
        if (stitchAlpha < 0.01) {
          float stitchLuminance = dot(stitchSample.rgb, vec3(0.299, 0.587, 0.114));
          stitchAlpha = step(0.1, stitchLuminance) * (1.0 - step(0.9, stitchLuminance));
        }
        
        // Final result with quality stitching
        finalResult = mix(afterDiamond, stitchColor, stitchAlpha * 0.85);
      }
      
      // Apply external stitchings (always shown, independent of pattern stitching)
      // External stitching uses conditional UV mapping based on seatType
      float externalStitchY = uIsTwoTone ? vUv.y :  vUv.y ;
      vec2 externalStitchUV = vec2(vUv.x, externalStitchY);
      vec4 externalStitchSample = texture2D(externalStitchMap, externalStitchUV);
      
      float externalStitchAlpha = externalStitchSample.a;
      if (externalStitchAlpha < 0.01) {
        float externalStitchLuminance = dot(externalStitchSample.rgb, vec3(0.299, 0.587, 0.114));
        externalStitchAlpha = step(0.1, externalStitchLuminance) * (1.0 - step(0.9, externalStitchLuminance));
      }
      
      // Apply external stitching with separate external stitch color
      finalResult = mix(finalResult, externalStitchColor, externalStitchAlpha * 0.85);
      
      gl_FragColor = vec4(finalResult, 1.0);
    }
  `;
  
  return new THREE.ShaderMaterial({
    uniforms: {
      aoMap: { value: textures.ao },
      diamondNormalMap: { value: textures.diamondNormal },
      stitchMap: { value: textures.stitch },
      externalStitchMap: { value: textures.externalStitch || textures.stitch },
      fabricColor: { value: new THREE.Color(fabricColor) },
      stitchColor: { value: new THREE.Color(stitchColor || '#ffffff') },
      externalStitchColor: { value: new THREE.Color(externalStitchColor || stitchColor || '#ffffff') },
      grainMap: { value: leatherGrainTexture }, // ✅ Added uniform for fine-grain bump
      ambientStrength: { value: ambientStrength },
      specularPower: { value: specularPower },
      specularIntensity: { value: specularIntensity },
      uIsTwoTone: { value: isTwoTone },
      uNoStitching: { value: noStitching }
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  });
};

/**
 * Updates Carroll Leather material uniforms for dynamic color changes
 */
export const updateCarrollLeatherUniforms = (material, fabricColor, stitchColor, ambientStrength, specularPower, specularIntensity, externalStitchColor = null) => {
  if (material.uniforms) {
    if (fabricColor) {
      material.uniforms.fabricColor.value.set(fabricColor);
    }
    if (stitchColor) {
      material.uniforms.stitchColor.value.set(stitchColor);
    }
    if (externalStitchColor && material.uniforms.externalStitchColor) {
      material.uniforms.externalStitchColor.value.set(externalStitchColor);
    }
    if (ambientStrength !== undefined && ambientStrength !== null) {
      material.uniforms.ambientStrength.value = ambientStrength;
    }
    if (specularPower !== undefined && specularPower !== null) {
      material.uniforms.specularPower.value = specularPower;
    }
    if (specularIntensity !== undefined && specularIntensity !== null) {
      material.uniforms.specularIntensity.value = specularIntensity;
    }
    material.needsUpdate = true;
  }
};
