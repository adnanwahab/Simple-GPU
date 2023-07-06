"use strict";
(() => {
  // src/demos/shader2.js
  var noise = `

    fn taylorInvSqrt( r: vec4<f32>) -> vec4<f32>
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    fn snoise( v: vec3<f32>) -> f32
      {
        var  C = vec2(1.0/6.0, 1.0/3.0) ;
        var  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
    var i = floor(v + dot(v, C.yyy) );
    var x0 =   v - i + dot(i, C.xxx) ;
    
    // Other corners
    var g = step(x0.yzx, x0.xyz);
    var l = 1.0 - g;
    var i1 = min( g.xyz, l.zxy );
    var i2 = max( g.xyz, l.zxy );
    
      var x1 = x0 - i1 + C.xxx;
      var x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      var x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    
    // Permutations
      i = mod289(i);
      var p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    let n_ = 0.142857142857; // 1.0/7.0
    let  ns = n_ * D.wyz - D.xzx;
    
    let j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    
    let x_ = floor(j * ns.z);
    let y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
    let x = x_ *ns.x + ns.yyyy;
    let y = y_ *ns.x + ns.yyyy;
    let h = 1.0 - abs(x) - abs(y);
    
    let b0 = vec4( x.xy, y.xy );
    let b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      let s0 = floor(b0)*2.0 + 1.0;
      let s1 = floor(b1)*2.0 + 1.0;
      let sh = -step(h, vec4(0.0));
    
      let a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      let a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      var p0 = vec3(a0.xy,h.x);
      var p1 = vec3(a0.zw,h.y);
      var p2 = vec3(a1.xy,h.z);
      var p3 = vec3(a1.zw,h.w);
    
    //Normalise gradients
      var norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
    
    // Mix final noise value
    //t m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      
    var m = (0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)));
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
      }
    
    //ramp function = f(x) -> x .0-.2 = 1 [1,2,3,4,5]
    
    const list=5.;
    
    fn curl_noise (pos:vec4<f32>, t: f32) -> vec4<f32> {
      //make unit cube
      //take 8 gradients of trilinear interpolations |-|
      var x = pos.x;
      var y = pos.y;
      var z = pos.z;
      var x0 = x + 1.;
      return vec4<f32>(sfrand(), sfrand(), sfrand(), sfrand());
    }
    
    fn snoiseVec3(  x: vec3<f32> ) -> vec3<f32>{
      var s  = snoise(vec3( x ));
      var s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
      var s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
      var c = vec3( s , s1 , s2 );
      return c;
    
    }
    
    fn curlNoise(  p:vec3<f32> ) -> vec3<f32>{
      var e = .00001;
      var dx = vec3( e   , 0.0 , 0.0 );
      var dy = vec3( 0.0 , e   , 0.0 );
      var dz = vec3( 0.0 , 0.0 , e   );
    
      var p_x0 = snoiseVec3( p - dx );
      var p_x1 = snoiseVec3( p + dx );
      var p_y0 = snoiseVec3( p - dy );
      var p_y1 = snoiseVec3( p + dy );
      var p_z0 = snoiseVec3( p - dz );
      var p_z1 = snoiseVec3( p + dz );
    
      var x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
      var y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
      var z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
    
      var divisor = 1.0 / ( 2.0 * e );
      return normalize( vec3( x , y , z ) * divisor );
    }
    
     fn mod289( x: vec3<f32>) -> vec3<f32> {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    fn mod289v( x: vec4<f32>)  ->vec4<f32>
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    fn permute( x: vec4<f32>) -> vec4<f32>
    {
      return mod289v(((x*34.0)+1.0)*x);
    }
    
    
    fn fade( t: vec3<f32>) -> vec3<f32> {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
    }
    
    fn sfrand () -> f32{
      let co = vec2<f32>(${Math.random()}, ${Math.random()});
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    
  //   fn mrand() ->  f32{
  //     return (sfrand() * 2.) - 1.;
  //   }
  
  //   fn shift (x:f32)->f32 {
  //     return (x + 1.) / 2.;
  //   }
  
  //   fn hash (pos: vec3<f32>) -> i32 {
  //     //let idx = shift(pos.x) * 10 + shift(pos.y) * 1000 + shift(pos.z) * 100000;
  
    
  //     var x = (pos.x + 1) / 2.;
  //     var y = ((pos.y  * -1) + 1) / 2.;
  //     //if y > .99999 { y = 0; }
  //     //if x < -.5 { x = 0; }
  
  // //    return i32(0);
  //     return i32(x * 10 + y * 100);
  //     //return vec2<i32>(i32(x * 10), i32(y * 100));
  //   }
  `;
})();
