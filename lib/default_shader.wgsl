
@fragment
  fn main_fragment(
    @location(0) fragUV: vec2<f32>,
    @location(1) fragPosition: vec4<f32>
  ) -> @location(0) vec4<f32> {    
    var color = vec4<f32>(.0, 1., 0., 1.);
    var p = fragUV;
    var q = (p.x % 25. * 2.0 < 25.) == (p.y % 25. * 2.0 < 25.);
    var o = f32(q);
    var cubemapVec = fragPosition.xy;

    var time = sin(u.time * .0001);
    // var hi = textureSample(myTexture, mySampler, cubemapVec);
  
   return color;
};