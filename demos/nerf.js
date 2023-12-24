let NERF = 'https://nvlabs.github.io/instant-ngp/assets/nrc_new_vs_old.mp4'

//Instant Neural Graphics Primitives with a Multiresolution Hash Encoding
function main() {


    document.body.innerHTML += `
    <video controls="" autoplay="" name="media"><source src="https://nvlabs.github.io/instant-ngp/assets/nrc_new_vs_old.mp4" type="video/mp4"></video>
    `


    document.body.innerHTML += `
    <video class="centered" width="100%" autoplay="" muted="" loop="" playsinline="">
				<source src="https://nvlabs.github.io/instant-ngp/assets/teaser.mp4" type="video/mp4">
				Your browser does not support the video tag.
			</video>`


    document.body.innerHTML += `<video class="centered" width="100%" autoplay="" muted="" loop="" playsinline="">
    <source src="https://nvlabs.github.io/instant-ngp/assets/nerf_grid_lq.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>`

document.body.innerHTML += `<video class="centered" width="100.0%" autoplay="" muted="" loop="" playsinline="">
<source src="https://nvlabs.github.io/instant-ngp/assets/sdf_grid_lq.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>`
console.log('yay neural radiance field')
}

export default main