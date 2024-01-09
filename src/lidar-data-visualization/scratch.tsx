


//window.camera = camera
// window.addEventListener('resize', () => {
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight * .86;
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//     firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
// })
// const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 4
// camera.position.y = 2
// camera.position.z = 4
// scene.add(camera)
//const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true
// const renderer = new THREE.WebGLRenderer({
//     canvas,
//     antialias: true
// })
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor('#333')



function validateSceneData(data: any): data is SceneData {
    return (
        typeof data.device_gps_pose === 'object' &&
        typeof data.device_gps_pose.lat === 'number' &&
        typeof data.device_gps_pose.lon === 'number' &&
        typeof data.device_position === 'object' &&
        typeof data.device_position.x === 'number' &&
        typeof data.device_position.y === 'number' &&
        typeof data.device_position.z === 'number' &&
        typeof data.device_heading === 'object' &&
        typeof data.device_heading.w === 'number' &&
        typeof data.device_heading.x === 'number' &&
        typeof data.device_heading.y === 'number' &&
        typeof data.device_heading.z === 'number' &&
        Array.isArray(data.images) &&
        data.images.every(image => 
            typeof image.fx === 'number' &&
            typeof image.fy === 'number' &&
            typeof image.cx === 'number' &&
            typeof image.cy === 'number' &&
            typeof image.position === 'object' &&
            typeof image.position.x === 'number' &&
            typeof image.position.y === 'number' &&
            typeof image.position.z === 'number' &&
            typeof image.heading === 'object' &&
            typeof image.heading.w === 'number' &&
            typeof image.heading.x === 'number' &&
            typeof image.heading.y === 'number' &&
            typeof image.heading.z === 'number' &&
            typeof image.image_url === 'string'
        ) &&
        typeof data.timestamp === 'number'
    );
}


let flexible: any = 4;
//any  = top type
let flexible2: unknown = 4;
// always use throw new Error
if (typeof flexible2 === 'string'){

}

let val: object = { status: 'ok' }
//val = 'foo' -> won't work
// val = null
val = () => 'ok'

let response = {success: 'ok', data: []} as 
{success: string; data: unknown } | { error: string }
//7 primitive value types 
// number, string, object, null, 

//let nullableString: string | null = null

let nullableString: string | null = null

let withoutUndefined: {} | null = 36
//Bottom Type: never

//type NonNullable<T> 


let myNull: null = null;
let myUndefined: undefined = undefined;

//null always refers to the same var/ref

class Grill {
  startGas() {}
  stopGas() {}
}

class Oven {
  setTemperature(degrees:number) {}
}

type IsLowNumber<t> = t extends 1 | 2 ? true : false

type TestTenWithTwo = IsLowNumber<10> | IsLowNumber<2>;

type CookingDevice<T> = T extends 'grid' ? Grill : Oven

type FavoriteColors = 
| 'dark Sienna'
| 'van dyke brown'
| 'yellow ochre'
| [number, number, number]
| {red: number; green: number; blue: number }


type TupleColors = Extract<FavoriteColors, any[]>
