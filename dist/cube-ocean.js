"use strict";
(() => {
  // src/demos/cube-ocean.js
  var vertexShader = `
uniform float amplitude;

varying vec3 vViewPosition;
varying vec3 vNormal;

vec3 rotateVectorByQuaternion( vec3 v, vec4 q ) {

  vec3 dest = vec3( 0.0 );

  float x = v.x, y  = v.y, z  = v.z;
  float qx = q.x, qy = q.y, qz = q.z, qw = q.w;

  // calculate quaternion * vector

  float ix =  qw * x + qy * z - qz * y,
      iy =  qw * y + qz * x - qx * z,
      iz =  qw * z + qx * y - qy * x,
      iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quaternion

  dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

  return dest;

}

vec4 axisAngleToQuaternion( vec3 axis, float angle ) {

  vec4 dest = vec4( 0.0 );

  float halfAngle = angle / 2.0,
      s = sin( halfAngle );

  dest.x = axis.x * s;
  dest.y = axis.y * s;
  dest.z = axis.z * s;
  dest.w = cos( halfAngle );

  return dest;

}

void main() {

  vec4 rotation = vec4( 0.0, 1.0, 0.0, amplitude * length( color ) * 0.001 );
  vec4 qRotation = axisAngleToQuaternion( rotation.xyz, rotation.w );

  vec3 newPosition = rotateVectorByQuaternion( position - color, qRotation ) + color;
  vNormal = normalMatrix * rotateVectorByQuaternion( normal, qRotation );

  vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;

}
`;
  var fragmentShader = `	varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {

  vec3 normal = normalize( vNormal );

  // directional light

  const vec3 lightCol1 = vec3( 0.5, 0.8, 1.0 );
  const vec3 lightDir1 = vec3( 0.0, -1.0, 0.0 );
  const float intensity1 = 0.5;

  vec4 lDirection1 = viewMatrix * vec4( lightDir1, 0.0 );
  vec3 lightVec1 = normalize( lDirection1.xyz );

  // point light

  const vec3 lightPos2 = vec3( 0.0, 0.0, 0.0 );
  const vec3 lightCol2 = vec3( 0.0, 0.0, 0.5 );
  const float maxDistance2 = 2000.0;
  const float intensity2 = 1.5;

  vec4 lPosition = viewMatrix * vec4( lightPos2, 1.0 );
  vec3 lVector = lPosition.xyz + vViewPosition.xyz;

  vec3 lightVec2 = normalize( lVector );
  float lDistance2 = 1.0 - min( ( length( lVector ) / maxDistance2 ), 1.0 );

  // point light

  const vec3 lightPos3 = vec3( 0.0, -1000.0, 1000.0 );
  const vec3 lightCol3 = vec3( 1.0, 0.1, 0.0 );
  const float maxDistance3 = 3000.0;
  const float intensity3 = 1.0;

  vec4 lPosition3 = viewMatrix * vec4( lightPos3, 1.0 );
  vec3 lVector3 = lPosition3.xyz + vViewPosition.xyz;

  vec3 lightVec3 = normalize( lVector3 );
  float lDistance3 = 1.0 - min( ( length( lVector3 ) / maxDistance3 ), 1.0 );

  //

  float diffuse1 = intensity1 * max( dot( normal, lightVec1 ), 0.0 );
  float diffuse2 = intensity2 * max( dot( normal, lightVec2 ), 0.0 ) * lDistance2;
  float diffuse3 = intensity2 * max( dot( normal, lightVec3 ), 0.0 ) * lDistance3;

  gl_FragColor = vec4( diffuse1 * lightCol1 + diffuse2 * lightCol2 + diffuse3 * lightCol3, 1.0 );
}`;
  function init() {
    container = document.body;
    camera = new THREE.PerspectiveCamera(37, window.innerWidth / window.innerHeight, 1, 8e3);
    camera.position.z = 2750;
    camera.position.y = 1250;
    scene = new THREE.Scene();
    camera.lookAt(scene.position);
    var triangles = 12 * 15e4;
    var geometry = new THREE.BufferGeometry();
    geometry.attributes = {
      position: {
        itemSize: 3,
        array: new Float32Array(triangles * 3 * 3),
        numItems: triangles * 3 * 3
      },
      normal: {
        itemSize: 3,
        array: new Float32Array(triangles * 3 * 3),
        numItems: triangles * 3 * 3
      },
      color: {
        itemSize: 3,
        array: new Float32Array(triangles * 3 * 3),
        numItems: triangles * 3 * 3
      }
    };
    var positions = geometry.attributes.position.array;
    var normals = geometry.attributes.normal.array;
    var colors = geometry.attributes.color.array;
    var n = 8e3, n2 = n / 2;
    var d = 10, d2 = d / 2;
    var color2 = new THREE.Color();
    var pA = new THREE.Vector3();
    var pB = new THREE.Vector3();
    var pC = new THREE.Vector3();
    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();
    var m2 = new THREE.Matrix4();
    var m22 = new THREE.Matrix4();
    var e = new THREE.Vector3(0, 0, 0);
    var t = new THREE.Vector3();
    var tt = new THREE.Vector3();
    var u = new THREE.Vector3(0, 1, 0);
    var v1 = new THREE.Vector3(0, 0, 0);
    var v2 = new THREE.Vector3(d, 0, 0);
    var v3 = new THREE.Vector3(d, d, 0);
    var v4 = new THREE.Vector3(0, d, 0);
    var v1b = new THREE.Vector3(0, 0, d);
    var v2b = new THREE.Vector3(d, 0, d);
    var v3b = new THREE.Vector3(d, d, d);
    var v4b = new THREE.Vector3(0, d, d);
    function addTriangle(k, x2, y2, z2, vc, vb, va) {
      pA.copy(va);
      pB.copy(vb);
      pC.copy(vc);
      t.set(x2, y2, z2);
      t.multiplyScalar(0.5);
      m2.lookAt(e, tt, u);
      m22.makeTranslation(t);
      m22.multiplySelf(m2);
      m22.multiplyVector3(pA);
      m22.multiplyVector3(pB);
      m22.multiplyVector3(pC);
      var ax = pA.x;
      var ay = pA.y;
      var az = pA.z;
      var bx = pB.x;
      var by = pB.y;
      var bz = pB.z;
      var cx = pC.x;
      var cy = pC.y;
      var cz = pC.z;
      var j = k * 9;
      positions[j] = ax;
      positions[j + 1] = ay;
      positions[j + 2] = az;
      positions[j + 3] = bx;
      positions[j + 4] = by;
      positions[j + 5] = bz;
      positions[j + 6] = cx;
      positions[j + 7] = cy;
      positions[j + 8] = cz;
      pA.set(ax, ay, az);
      pB.set(bx, by, bz);
      pC.set(cx, cy, cz);
      cb.sub(pC, pB);
      ab.sub(pA, pB);
      cb.crossSelf(ab);
      cb.normalize();
      var nx = cb.x;
      var ny = cb.y;
      var nz = cb.z;
      normals[j] = nx;
      normals[j + 1] = ny;
      normals[j + 2] = nz;
      normals[j + 3] = nx;
      normals[j + 4] = ny;
      normals[j + 5] = nz;
      normals[j + 6] = nx;
      normals[j + 7] = ny;
      normals[j + 8] = nz;
      color2.setRGB(t.x, t.y, t.z);
      colors[j] = color2.r;
      colors[j + 1] = color2.g;
      colors[j + 2] = color2.b;
      colors[j + 3] = color2.r;
      colors[j + 4] = color2.g;
      colors[j + 5] = color2.b;
      colors[j + 6] = color2.r;
      colors[j + 7] = color2.g;
      colors[j + 8] = color2.b;
    }
    for (var i = 0; i < triangles; i += 12) {
      var x = THREE.Math.randFloat(0.1 * n, 0.2 * n) * (Math.random() > 0.5 ? 1 : -1) * THREE.Math.randInt(0.5, 2);
      var y = THREE.Math.randFloat(0.1 * n, 0.2 * n) * (Math.random() > 0.5 ? 1 : -1) * THREE.Math.randInt(0.5, 2);
      var z = THREE.Math.randFloat(0.1 * n, 0.2 * n) * (Math.random() > 0.5 ? 1 : -1) * THREE.Math.randInt(0.5, 2);
      tt.set(Math.random(), Math.random(), Math.random());
      addTriangle(i, x, y, z, v1, v2, v4);
      addTriangle(i + 1, x, y, z, v2, v3, v4);
      addTriangle(i + 2, x, y, z, v4b, v2b, v1b);
      addTriangle(i + 3, x, y, z, v4b, v3b, v2b);
      addTriangle(i + 4, x, y, z, v1b, v2, v1);
      addTriangle(i + 5, x, y, z, v1b, v2b, v2);
      addTriangle(i + 6, x, y, z, v2b, v3, v2);
      addTriangle(i + 7, x, y, z, v2b, v3b, v3);
      addTriangle(i + 8, x, y, z, v3b, v4, v3);
      addTriangle(i + 9, x, y, z, v3b, v4b, v4);
      addTriangle(i + 10, x, y, z, v1, v4, v1b);
      addTriangle(i + 11, x, y, z, v4, v4b, v1b);
    }
    uniforms = {
      amplitude: { type: "f", value: 0 }
    };
    var material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      vertexColors: THREE.VertexColors
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer({ antialias: false, clearColor: 328965, clearAlpha: 1, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    window.addEventListener("resize", onWindowResize, false);
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  var uniforms;
  var container;
  var camera;
  var scene;
  var renderer;
  var mesh;
  var clock = new THREE.Clock();
  function stuff2() {
    init();
    animate();
  }
  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  function render() {
    var time = Date.now() * 1e-3;
    var delta = clock.getDelta();
    mesh.rotation.x = time * 0.025;
    mesh.rotation.y = time * 0.05;
    uniforms.amplitude.value += 2 * delta;
    renderer.render(scene, camera);
  }
  var cube_ocean_default = stuff2;
})();
