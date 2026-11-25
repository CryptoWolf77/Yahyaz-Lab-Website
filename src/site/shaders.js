// GLSL for the Nebula scene. Kept apart from scene.js so the logic stays readable.

const noise = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

export const particleVertex = /* glsl */ `
uniform float uTime;
uniform float uFrom;
uniform float uTo;
uniform float uMix;
uniform float uTurb;
uniform float uScale;
uniform float uSize;
uniform float uGain;
uniform float uLogoGain;
uniform vec4 uLogoA;
uniform vec4 uLogoB;
uniform float uAnchorZ;
uniform float uCamZ;
uniform vec3 uPlanetA;
uniform vec3 uPlanetB;
uniform float uGalaxyR;
uniform float uGalaxyTilt;
uniform float uGalaxyRoll;
uniform vec2 uGalaxyOff;
uniform float uTunnelR;
uniform float uTunnelLen;
uniform float uFlow;
uniform float uHue;
uniform float uGreen;
uniform float uSolo;
uniform float uFogNear;
uniform float uFogFar;
uniform float uMaxSize;

attribute vec3 aVoid;
attribute vec3 aLogo;
attribute vec3 aGalaxy;
attribute vec3 aPlanet;
attribute vec4 aTunnel;
attribute vec3 aColLogo;
attribute vec3 aColCos;
attribute vec4 aRand;

varying vec3 vColor;
varying float vAlpha;

${noise}

vec3 rotX(vec3 p, float a){ float c = cos(a); float s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 rotY(vec3 p, float a){ float c = cos(a); float s = sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
vec3 rotZ(vec3 p, float a){ float c = cos(a); float s = sin(a); return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z); }

vec3 posLogo(vec4 L){
  return vec3(L.x + aLogo.x * L.w, L.y + aLogo.y * L.w, L.z + aLogo.z * L.w);
}
vec3 posGalaxy(){
  float r = aGalaxy.x;
  float th = aGalaxy.y + uTime * 0.035 + 0.06 * sin(uTime * 0.07 + r * 3.0);
  vec3 p = vec3(cos(th) * r, aGalaxy.z, sin(th) * r) * uGalaxyR;
  p = rotX(p, uGalaxyTilt);
  p = rotZ(p, uGalaxyRoll);
  return p + vec3(uGalaxyOff, uAnchorZ);
}
// uSolo: 0 = both worlds; 1 = every particle forms the Apps planet; -1 = the Games planet
bool planetIsA(){
  if (uSolo > 0.5) return true;
  if (uSolo < -0.5) return false;
  return aRand.w < 0.5;
}
vec3 soloColor(bool a){
  float r = aRand.z;
  if (a) {
    vec3 c = mix(vec3(0.027, 0.905, 1.0), vec3(0.69, 0.92, 1.0), step(0.62, r));
    return mix(c, vec3(0.05, 0.26, 1.0), step(0.86, r));
  }
  vec3 c = mix(vec3(1.0, 0.05, 0.26), vec3(1.0, 0.33, 0.55), step(0.5, r));
  return mix(c, vec3(1.0, 0.66, 0.065), step(0.78, r));
}
vec3 posPlanet(){
  bool a = planetIsA();
  vec3 c = a ? uPlanetA : uPlanetB;
  vec3 p = rotY(aPlanet, uTime * (a ? 0.16 : -0.12));
  p = rotX(p, a ? 0.42 : -0.32);
  p = rotZ(p, a ? -0.28 : 0.36);
  return vec3(c.xy, uAnchorZ) + p * c.z;
}
vec3 posTunnel(){
  float nearZ = 5.0;
  // hoops and gates are fixed in the world; dust and helix strands drift toward the camera
  float drifts = (aTunnel.w < 0.5 || aTunnel.w > 2.5) ? 1.0 : 0.0;
  float z0 = aTunnel.z * uTunnelLen + uFlow * drifts;
  float zw = uCamZ + nearZ - mod(uCamZ + nearZ - z0, uTunnelLen);
  float ang = aTunnel.x + zw * 0.028 + uTime * 0.012;
  float r = aTunnel.y * uTunnelR;
  return vec3(cos(ang) * r, sin(ang) * r * 0.84, zw);
}
vec3 targetPos(float id){
  if (id < 0.5) return aVoid + vec3(0.0, 0.0, uAnchorZ);
  if (id < 1.5) return posLogo(uLogoA);
  if (id < 2.5) return posGalaxy();
  if (id < 3.5) return posPlanet();
  if (id < 4.5) return posTunnel();
  return posLogo(uLogoB);
}
vec3 tunnelColor(){
  float r = aRand.z;
  vec3 cyan = mix(vec3(0.027, 0.905, 1.0), vec3(0.72, 0.92, 1.0), step(0.7, r));
  cyan = mix(cyan, vec3(1.0, 0.05, 0.26), step(0.94, r));
  vec3 pink = mix(vec3(1.0, 0.05, 0.26), vec3(1.0, 0.66, 0.065), step(0.72, r));
  pink = mix(pink, vec3(0.8, 0.9, 1.0), step(0.93, r));
  vec3 gold = mix(vec3(1.0, 0.62, 0.06), vec3(1.0, 0.9, 0.7), step(0.66, r));
  gold = mix(gold, vec3(1.0, 0.05, 0.26), step(0.95, r));
  vec3 green = mix(vec3(0.178, 1.0, 0.152), vec3(0.82, 1.0, 0.86), step(0.68, r));
  vec3 c = mix(cyan, pink, clamp(uHue, 0.0, 1.0));
  c = mix(c, gold, clamp(uHue - 1.0, 0.0, 1.0));
  c = mix(c, green, uGreen * 0.85);
  // gates burn hotter toward white
  return aTunnel.w > 1.5 && aTunnel.w < 2.5 ? mix(c, vec3(1.0), 0.32) : c;
}
// colour, intensity, size, drift for a state
vec4 look(float id, out vec3 col){
  if (id < 0.5) { col = aColCos; return vec4(0.9, 1.25, 0.25, 0.0); }
  if (id < 1.5 || id > 4.5) { col = aColLogo; return vec4(uLogoGain, 1.0, 0.0025, 0.0); }
  if (id < 2.5) { col = aColCos; return vec4(0.95, 1.12, 0.02, 0.0); }
  if (id < 3.5) {
    bool solo = abs(uSolo) > 0.5;
    col = solo ? soloColor(uSolo > 0.0) : aColCos;
    float band = 0.48 + 0.26 * sin(aPlanet.y * 11.0 + aRand.z * 1.2);
    return vec4(band * (solo ? 0.6 : 1.0), 1.0, 0.01, 0.0);
  }
  col = tunnelColor();
  float t = aTunnel.w;
  if (t < 0.5) return vec4(0.5, 1.45, 0.04, 0.0);   // dust
  if (t < 1.5) return vec4(0.95, 1.1, 0.008, 0.0);  // hoop
  if (t < 2.5) return vec4(1.2, 1.3, 0.012, 0.0);   // gate torus
  return vec4(0.78, 1.15, 0.01, 0.0);               // helix
}

void main(){
  float d = aRand.x;
  float p = clamp((uMix - d * 0.42) / 0.58, 0.0, 1.0);
  p = p * p * (3.0 - 2.0 * p);

  vec3 A = targetPos(uFrom);
  vec3 B = targetPos(uTo);
  vec3 pos = mix(A, B, p);

  float bell = sin(p * 3.14159265);
  if (bell > 0.002) {
    vec3 q = pos * 0.11 + vec3(0.0, 0.0, uTime * 0.1);
    vec3 n = vec3(snoise(q), snoise(q + vec3(31.4, 7.1, 2.9)), snoise(q + vec3(5.2, 17.3, 23.1)));
    pos += n * bell * uTurb;
  }

  vec3 colA;
  vec3 colB;
  vec4 la = look(uFrom, colA);
  vec4 lb = look(uTo, colB);
  vec4 lk = mix(la, lb, p);
  vec3 col = mix(colA, colB, p);

  float ph = aRand.z * 6.2831853;
  pos += vec3(sin(uTime * 0.55 + ph), cos(uTime * 0.47 + ph * 1.3), sin(uTime * 0.39 + ph * 0.7)) * lk.z;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float depth = -mv.z;
  gl_Position = projectionMatrix * mv;

  float twinkle = 0.8 + 0.2 * sin(uTime * (0.6 + aRand.y * 1.2) + ph);
  float fog = 1.0 - smoothstep(uFogNear, uFogFar, depth);
  float nearFade = smoothstep(0.35, 2.4, depth);
  vAlpha = lk.x * fog * nearFade * twinkle * uGain * (0.75 + 0.25 * bell);
  vColor = col;

  float size = uSize * lk.y * (0.55 + aRand.y * 0.9) * uScale / max(depth, 0.1);
  gl_PointSize = depth < 0.05 ? 0.0 : clamp(size, 0.0, uMaxSize);
}
`;

export const particleFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5 || vAlpha < 0.003) discard;
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  a *= a;
  float core = 1.0 - smoothstep(0.0, 0.14, d);
  gl_FragColor = vec4(vColor * (a + core * 0.7), vAlpha);
}
`;

export const starVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute vec4 aStar; // size, phase, speed, tint
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.65 + 0.35 * sin(uTime * aStar.z + aStar.y * 6.2831);
  vAlpha = tw;
  vec3 cyan = vec3(0.35, 0.85, 1.0);
  vec3 pink = vec3(1.0, 0.45, 0.7);
  vColor = aStar.w < 0.72 ? vec3(0.9, 0.94, 1.0) : (aStar.w < 0.88 ? cyan : pink);
  gl_PointSize = aStar.x * uPixelRatio;
}
`;

export const starFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  gl_FragColor = vec4(vColor * a * a, vAlpha * 0.55);
}
`;

export const hazeVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}
`;

export const hazeFragment = /* glsl */ `
uniform float uTime;
uniform vec2 uOffset;
uniform float uZoom;
uniform float uHue;
uniform float uGreen;
uniform float uAspect;
uniform float uStrength;
varying vec2 vUv;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * vnoise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
void main(){
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.4 / uZoom + uOffset;
  float n1 = fbm(p * 0.8 + vec2(uTime * 0.005, 0.0));
  float n2 = fbm(p * 1.5 - vec2(0.0, uTime * 0.004) + 7.3);
  float n3 = fbm(p * 3.1 + n1 * 1.7);
  vec3 base = vec3(0.0010, 0.0012, 0.0038);
  vec3 indigo = vec3(0.0034, 0.0052, 0.026);
  vec3 cyan = vec3(0.0, 0.05, 0.072);
  vec3 pink = vec3(0.085, 0.004, 0.034);
  vec3 gold = vec3(0.07, 0.034, 0.002);
  vec3 accent = mix(cyan, pink, clamp(uHue, 0.0, 1.0));
  accent = mix(accent, gold, clamp(uHue - 1.0, 0.0, 1.0));
  accent = mix(accent, vec3(0.012, 0.075, 0.018), uGreen);
  vec3 second = mix(pink, cyan, clamp(uHue, 0.0, 1.0));
  float glowA = smoothstep(0.42, 0.95, n1) * (0.6 + 0.6 * n3);
  float glowB = smoothstep(0.5, 1.0, n2) * (0.5 + 0.5 * n3);
  vec3 col = base + indigo * smoothstep(0.15, 0.85, n1) * 1.4;
  col += accent * glowA * uStrength;
  col += second * glowB * 0.34 * uStrength;
  // keep the text column calmer
  float vign = smoothstep(1.25, 0.2, length((vUv - 0.5) * vec2(uAspect * 0.8, 1.0)));
  col *= 0.55 + 0.45 * vign;
  gl_FragColor = vec4(col, 1.0);
}
`;

// Screens: rounded card with bezel, emissive rim and soft outer glow, optional bend.
export const cardVertex = /* glsl */ `
uniform float uCurve;
varying vec2 vUv;
void main(){
  vUv = uv;
  vec3 p = position;
  p.z -= uCurve * p.x * p.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const cardFragment = /* glsl */ `
uniform sampler2D uMap;
uniform float uHasMap;
uniform float uOpacity;
uniform float uRadius;
uniform float uBezel;
uniform float uGlow;
uniform vec2 uPlane;
uniform vec2 uCard;
uniform vec3 uRim;
uniform float uTime;
varying vec2 vUv;
float sdRound(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main(){
  vec2 p = (vUv - 0.5) * uPlane;
  float dO = sdRound(p, uCard * 0.5, uRadius);
  vec2 inner = uCard * 0.5 - vec2(uBezel);
  float dS = sdRound(p, inner, max(uRadius - uBezel, 0.015));
  float aa = max(fwidth(dO), 0.0008);

  float outside = smoothstep(-aa, aa, dO);
  float glow = exp(-max(dO, 0.0) * 14.0) * uGlow * outside;
  vec3 col = uRim * glow;
  float alpha = glow * 0.55;

  vec2 suv = (p + inner) / (inner * 2.0);
  suv = clamp(suv, 0.0, 1.0);
  vec3 tex = texture2D(uMap, suv, -0.6).rgb; // slight negative LOD bias keeps UI text crisp
  float sweep = smoothstep(0.0, 1.0, 1.0 - abs(fract(uTime * 0.05 + vUv.x * 0.3) - 0.5) * 2.0);
  vec3 empty = vec3(0.004, 0.006, 0.016) + uRim * 0.012 * sweep;
  vec3 screen = mix(empty, tex, uHasMap);
  float inScreen = 1.0 - smoothstep(-aa, aa, dS);
  vec3 bezel = mix(vec3(0.006, 0.008, 0.02), vec3(0.02, 0.025, 0.05), vUv.y);
  vec3 body = mix(bezel, screen, inScreen);
  float rim = 1.0 - smoothstep(0.0, aa * 2.2, abs(dO + aa * 1.2));
  body += uRim * rim * 0.9;
  float inside = 1.0 - outside;
  col = mix(col, body, inside);
  alpha = mix(alpha, 1.0, inside);
  gl_FragColor = vec4(col, alpha * uOpacity);
}
`;

// Phone body: dark glass slab with a fresnel rim, so the frame reads as an object.
export const bodyVertex = /* glsl */ `
varying vec3 vN;
varying vec3 vV;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

export const bodyFragment = /* glsl */ `
uniform vec3 uRim;
uniform float uOpacity;
varying vec3 vN;
varying vec3 vV;
void main(){
  float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
  vec3 col = vec3(0.008, 0.01, 0.024) + uRim * f * 0.55;
  gl_FragColor = vec4(col, uOpacity);
}
`;

// Final pass: vignette, linear -> sRGB, gentle film grain (in display space).
export const finalShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uGrain: { value: 0.026 },
    uVignette: { value: 0.42 },
    uRes: { value: null },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uVignette;
    uniform vec2 uRes;
    varying vec2 vUv;
    float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    vec3 toSRGB(vec3 c){
      c = clamp(c, 0.0, 1.0);
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
    }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      vec2 q = vUv - 0.5;
      q.x *= uRes.x / uRes.y;
      float v = smoothstep(1.05, 0.2, length(q));
      c *= mix(1.0 - uVignette, 1.0, v);
      c = toSRGB(c);
      float g = hash(vUv * uRes + floor(uTime * 24.0) * 17.0) - 0.5;
      c += g * uGrain;
      gl_FragColor = vec4(c, 1.0);
    }
  `,
};
