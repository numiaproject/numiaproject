//ANKI lol
//source
//https://foosoft.net/projects/anki-connect/ 

// invoke
const invoke = async function(action, version, params={}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => reject('failed to issue request'));
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw 'response has an unexpected number of fields';
                }
                if (!response.hasOwnProperty('error')) {
                    throw 'response is missing required error field';
                }
                if (!response.hasOwnProperty('result')) {
                    throw 'response is missing required result field';
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                reject(e);
            }
        });

        xhr.open('POST', 'http://127.0.0.1:8765');
        xhr.send(JSON.stringify({action, version, params}));
    });
}
  
// Start function
const start = async function(action, version, params={}) {

//function to create a test deck
//await invoke('createDeck', 6, {deck: 'test1'});

//get deck names
const result = await invoke('deckNames', 6);

var h1 = document.createElement('h1');
h1.textContent = 'Got list of anki decks:\r\n';

var p = document.createElement('p');
p.setAttribute('style', 'white-space: pre;');
result.forEach(name => {
    p.textContent += name + '\r\n';
});

document.getElementById('home-image-box').appendChild(h1);
document.getElementById('home-image-box').appendChild(p);
}
  
// Call start
start();

//=======================================//

//Texture loader
const loader = new THREE.TextureLoader();
const particleTexture = loader.load('./images/numia/particletexture.png');

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

let particleSystem, point, particles, particleCount;

particleCount = 250;

particleSystem = new THREE.Geometry();
for (let i=0; i < particleCount; i++) 
{
	point = new THREE.Vector3(
		THREE.MathUtils.randFloatSpread(w),
		THREE.MathUtils.randFloatSpread(h),
		THREE.MathUtils.randFloat(-500, 0)
	);
	
	let dir = 1 - THREE.MathUtils.randInt(0, 1) * 2; //this should yield either 1 or -1.

	
	point.velocity = new THREE.Vector3( THREE.MathUtils.randFloat(0.2, 0.4) * dir, 
										THREE.MathUtils.randFloat(0.2, 0.4) * dir, 
										THREE.MathUtils.randFloat(0.2, 0.4) * dir);

	point.acceleration = 0.0;

	particleSystem.vertices.push(point);
}

const material = new THREE.PointsMaterial( {
	size: 3,
	map: particleTexture,
	transparent: true, //needed to actually see the particle texture
	color: 0xFFFFFF 
} );

particles = new THREE.Points( particleSystem, material );

scene.add(particles);

//clock for animate
var clock = new THREE.Clock();
var speed = 2; //units a second
var delta = 0;

/*
	reference
	https://www.youtube.com/watch?v=Bed1z7f1EI4
*/

/* OTHER GENERAL VARIABLE */
var margin = 100; //margin for extending the boundary for the particle; gonna be added to height and width.

//========================CUSTOM FUNCTION =======================//
function updateParticleSystem()
{
	particleSystem.vertices.forEach(p => {
		//p.velocity += p.acceleration;
		p.x += p.velocity.x;
		p.y += p.velocity.y;
		p.z += p.velocity.z;

		//circular movement particles
		// let radius = 20;

		// let position = new THREE.Vector3(0, 0, 0);
		// position.x = radius * Math.cos(clock.getDelta());
		// position.y = radius * Math.sin(clock.getDelta());

		// p.x = w/2;
		// p.y = h/2;
		// p.z = 10;

		//=======Keeping the point within the screen=============//
		//If the position of the point is beyond the screen size we send it back.
		//Getting point coordinate projected to screen
		let vector = new THREE.Vector3( p.x, p.y, p.z);
		vector.project(camera);

		vector.x = ( vector.x + 1) * w / 2;
		vector.y = - ( vector.y - 1) * h / 2;

		if(vector.x > (w+margin) || vector.x<(0-margin)) 
		{
			p.velocity.x = -p.velocity.x;
		}

		if(vector.y > (h+margin) || vector.y <(0-margin))
		{
			p.velocity.y = -p.velocity.y;
		}

		if(vector.z > 0 || vector.z < -500)
		{
			p.velocity.z = -p.velocity.z;
		}

	});

	particleSystem.verticesNeedUpdate = true;
	//particles.rotation.y += 0.002;
}

function particleMakeCircle()
{
	//choose a random particle
	//let i = THREE.MathUtils.randInt(0, particleCount-1);
	
	//radius of circle
	// let radius = 20;

	// let position = new THREE.Vector3();
	// position.x = radius * THREE.Math.cos(Date.now());
	// position.z = radius * THREE.Math.sin(Date.now());


}

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
	updateParticleSystem();

	//this appens sporadically; with a chance of 20% now;
	let chance = THREE.MathUtils.randInt(0, 100);
	if(chance<20)
	{
		particleMakeCircle();
	}
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
