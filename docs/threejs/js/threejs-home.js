const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialiasing: false });
//renderer.setPixelRatio( 2.0); INCREASE QUALITY
renderer.setClearColor( 0x91bad6, 1);
 var container = document.getElementsByClassName('home')[0];
 var w = container.offsetWidth;
 var h = container.offsetHeight;
 renderer.setSize(w, h);
container.appendChild(renderer.domElement);
 
const camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );
camera.position.z = 5;

//LIGHT

//Point light
const light = new THREE.PointLight( 0xffffff, 2.0);
light.position.set( 0, 0.5, 5);
scene.add(light);

let particleSystem, point, particles;

particleSystem = new THREE.Geometry();
for (let i=0; i < 200; i++) 
{
	point = new THREE.Vector3(
		THREE.MathUtils.randFloatSpread(1000),
		THREE.MathUtils.randFloatSpread(1000),
		THREE.MathUtils.randFloat(-500, 0)
	);
	
	let dir = 1 - THREE.MathUtils.randInt(0, 1) * 2; //this should yield either 1 or -1.

	point.velocity = THREE.MathUtils.randFloat(0.2, 0.4) * dir;
	point.acceleration = 0.0;

	particleSystem.vertices.push(point);
}

const material = new THREE.PointsMaterial( { color: 0xFFFFFF } );

particles = new THREE.Points( particleSystem, material );

scene.add(particles);

/*
	reference
	https://www.youtube.com/watch?v=Bed1z7f1EI4
*/

//========================EVENT==================================//

//Resize window
var onWindowResize = function()
{
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	camera.aspect = container.offsetWidth/container.offsetHeight;
	camera.updateProjectionMatrix();
}

window.addEventListener('resize', onWindowResize);

//========================MAIN PIPELINE=============================//

//Game logic
var update = function()
{
	particleSystem.vertices.forEach(p => {
		p.velocity += p.acceleration;
		p.x += p.velocity;
		p.y += p.velocity;
		p.z += p.velocity;
	});

	particleSystem.verticesNeedUpdate = true;
	//particles.rotation.y += 0.002;
}

//Draw scene
var render = function()
{
	renderer.render(scene, camera);
}

//Run game loop (update, render, repeat)
var GameLoop = function()
{
	requestAnimationFrame(GameLoop);

	update();
	render();

}

GameLoop();
