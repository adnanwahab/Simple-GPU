import webgpuInit from '../lib/main'

const time = 0;
async function basic () {
    const webgpu = await webgpuInit();
    webgpu.initDrawCall({
        // Shaders in simplewebgpu. are just strings. 
        frag: `
        @fragment
      fn main(
          //@location(0) position: vec4<f32>,
          //@location(1) color: vec4<f32>,
        ) -> @location(0) vec4<f32> {
          //return color;
          return vec4(${Math.random()}, 0.0, 0, 1.0);
        }`,
      
        vert: `
        struct VertexOutput {
          @builtin(position) Position : vec4<f32>,
          @location(0) fragUV : vec2<f32>,
          @location(1) fragPosition: vec4<f32>,
        }  
      
        fn rotateVectorByQuaternion( vec3 v, vec4 q ) {
          vec3 dest = vec3( 0.0 );
          float x = v.x, y = v.y, z = v.z;
          float qx = q.x, qy = q.y, qz = q.z, qw = q.w;
          
          // calculate quaternion * vector
          
          
          float ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
          
          // calculate result * inverse quaternion
          
          
          dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
          dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
          dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
          return dest;
        }
        
        fn axisAngleToQuaternion( vec3 axis, float angle ) {
          vec4 dest = vec4( 0.0 );
          float halfAngle = angle / 2.0, s = sin( halfAngle );
          dest.x = axis.x * s;
          dest.y = axis.y * s;
          dest.z = axis.z * s;
          dest.w = cos( halfAngle );
          return dest;
        }


        @vertex
        fn main(
          @location(0) position : vec4<f32>,
          @location(1) uv : vec2<f32>
        ) -> VertexOutput {
          
          var output : VertexOutput;
          output.Position = position;
          output.fragUV = uv;
          output.fragPosition = position;
          return output;
        }`,
      
        // Here we define the vertex attributes for the above shader
        attributes: {
          // simplewebgpu.buffer creates a new array buffer object
          position: new webgpu.attribute([
            [-1, 0],
            [0, -1],
            [1, 1]
          ], 0, 2)
          
          // , color: [
          //   [1,0,0],
          //   [0,1,0],
          //   [1,0,1],
          // ]
          // simpleWebgpu automatically infers sane defaults for the vertex attribute pointers
        },
      
        // uniforms: {
        //   // This defines the color of the triangle to be a dynamic variable
        //   color: webgpu.prop('color')
        // },
      
        // This tells simpleWebgpu the number of vertices to draw in this command
        count: 3
      }).then(draw => {
        draw({
          color: [
            Math.cos(time * 0.001),
            Math.sin(time * 0.0008),
            Math.cos(time * 0.003),
            1
          ]
        })
    
        draw({
          color: [
            Math.cos(time * 0.001),
            Math.sin(time * 0.0008),
            Math.cos(time * 0.003),
            1
          ]
        })
      })

}
export default basic;