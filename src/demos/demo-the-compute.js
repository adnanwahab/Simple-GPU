///10 ideas to finish demo forever 
//population future city simulation 24 hour s 3-30days depenidng on how long - 3 years depending on sophisitication
//model growth of cities -> starts out wit like 5 housres and a pond and a city hall
//grows into nyc with 8 million people or LA with 20 million 
//minority report - add inicdiense - send cops and firefighters - add vehicles -- collisions 
//resources like food and water have to be delivered 
//mycelium - 3-7 days
//economics - 3-7 days 
// lava floes - 3-7 days
//traffic floes ==  
//try 7 simulations in 7 days 
//take best one and polish for a week 
//done by 17
//dont do any of these - shodan 


const shared_functions = 
`fn hashPosition(p: vec3<f32>) ->  i32{
    var pos = p % 2.;

    var x = (pos.x + 1) / 2.;
    var y = (1. - (pos.y)) / 2.;
    var z = (1. - (pos.z)) / 2.;

    var idx = i32(floor(x * 100) + floor(floor(y * 100) * 100)
    + floor(floor(z * 100) * 100) * 100
    );
    return idx;
  }`

        export const  demo = `
struct Uniforms {
    mouse: vec2<f32>,
    time: f32,
    mode: f32,
    attenuationRate: f32
}
fn hasCollided (p: vec3<f32>)-> bool {
    var minX = -1; 
    var bounds = 10.;
    
    if (p.x < -bounds) {return true;}
     if (p.y <= -bounds) {return true;} //why is this backwards? 
        if (p.x >= bounds) {return true;}
        if (p.y >= bounds) {return true;}
        if (p.z <= -bounds ) {return true;}
        if (p.z >= bounds ){ return true;}
        return false;
    if (p.y <= -bounds) {return true;} //why is this backwards? 
    if (p.x >= bounds) {return true;}
    if (p.y >= bounds) {return true;}
    if (p.z <= -bounds ) {return true;}
    if (p.z >= bounds ){ return true;}
    return false;
  }

    @group(0) @binding(0) var<storage, read_write> graphicsRenderingBuffer: array<vec4<f32>>;
    @group(0) @binding(1) var<storage, read_write> location: array<vec4<f32>>;
    @group(0) @binding(2) var <uniform> uniforms: Uniforms;
    @group(0) @binding(3) var<storage, read_write> rateOfChange: array<vec3<f32>>;
    @group(0) @binding(5) var<storage, read_write> recenter: array<vec4<f32>>;
    @group(0) @binding(6) var<storage, read_write> coolSixBuffer: array<vec4<f32>>;

    fn createAcceleration () -> vec4<f32> {
     
        return vec4<f32>(0.);
    }

    ${shared_functions}
    fn hi(index:u32) {
        var screenSpaceIndex = location[index];
        var idx = hashPosition(screenSpaceIndex.xyz);


        //modulo - checkerboard 3d converge + diverge
        //modulo - checkerboard 3d - orbit 
        //modulo checkerboard 3d - spiral 
        //

        //rainbow super algae - make it spread procedurally and blossom and send rainbow spiral smoke upward that makes atmosphere happy
        //smoke simulation + algae simulation

        //mycellium simulation

        graphicsRenderingBuffer[idx] = vec4<f32>(
            
        );


    //triangle a point based on every location and its reflected neighbors across 6 axis 

        rateOfChange[index] += .01 * graphicsRenderingBuffer[idx].xyz;
        location[index] = screenSpaceIndex + .1 * vec4<f32>(rateOfChange[index], 1.);
    }


    fn initPlus () {
        if (location[0].x  != 0.){
            return;
        }

        // if (uniforms.time < 1000) {
        //     return;
        // }
        location[0] = vec4<f32>(.5,0.,0.,0.);
        location[1] = vec4<f32>(.6, 0., 0.,0.);
        location[2] = vec4<f32>(.7, 0.,0., 0.);
        location[3] = vec4<f32>(.8, 0.,0., 0.);
        location[4] = vec4<f32>(.9, 0.,0., 0.);
  
        location[5] = vec4<f32>(.2, 0.,0., 0.);
        location[6] = vec4<f32>(.4, 0.,0., 0.);
        location[7] = vec4<f32>(.4, .1,0., 0.);
        location[8] = vec4<f32>(.4, .2,0., 0.);
        location[9] = vec4<f32>(.4, .3,0., 0.);
  
        location[10] = vec4<f32>(.5, 0.,0., 0.);
        location[12] = vec4<f32>(.1, 0.,0., 0.);
        location[11] = vec4<f32>(.3, 0.,0., 0.);
    }

    fn movePlus ( ) {
        location[0] -= vec4<f32>(.005,0.,0.,0.);
        location[1] -= vec4<f32>(.006, 0., 0.,0.);
        location[2] -= vec4<f32>(.007, 0.,0., 0.);
        location[3] -= vec4<f32>(.008, 0.,0., 0.);
        location[4] -= vec4<f32>(.009, 0.,0., 0.);
  
        location[5] -= vec4<f32>(.002, 0.,0., 0.);
        location[6] -= vec4<f32>(.004, 0.,0., 0.);
        location[7] -= vec4<f32>(.004, .1,0., 0.);
        location[8] -= vec4<f32>(.004, .2,0., 0.);
        location[9] -= vec4<f32>(.004, .3,0., 0.);
  
        location[10] -= vec4<f32>(.005, 0.,0., 0.);
        location[12] -= vec4<f32>(.001, 0.,0., 0.);
        location[11] -= vec4<f32>(.003, 0.,0., 0.);
    }


    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
      let index: u32 = GlobalInvocationID.x;
      var z1 = graphicsRenderingBuffer[index];
      var z2 = location[index];
      var z3 = rateOfChange[index];
      var z4 = recenter[index];
      var z5 = coolSixBuffer[index];
      var shit = uniforms.time;

        initPlus();
        //movePlus();

        hi(index);
    }
    
`;

//finish demo today
