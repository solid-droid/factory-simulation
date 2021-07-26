var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcccccc );
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000000);
renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
var back = false;

var controls = new THREE.OrbitControls( camera );
controls.mouseButtons = {
    ORBIT: THREE.MOUSE.RIGHT,
    ZOOM: THREE.MOUSE.MIDDLE,
    PAN: THREE.MOUSE.LEFT
  };

controls.enableDamping = true; 
controls.dampingFactor = 0.12;  
controls.rotateSpeed = 0.08; 
controls.autoRotate = false;
controls.autoRotateSpeed = 0.08;
controls.maxPolarAngle = Math.PI/2;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; //Shadow
renderer.shadowMapSoft = true; // Shadow
renderer.shadowMap.type = THREE.PCFShadowMap; //Shadow
document.body.appendChild(renderer.domElement);

var domEvents	= new THREEx.DomEvents(camera, renderer.domElement)

camera.position.x = 7000;
camera.position.y = 7000;
camera.position.z = 0;


// world

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
geometry.translate( 0, 0.5, 0 );

const groundMAT = new THREE.MeshPhongMaterial( { color: 0xdcdcdc, flatShading: true } );


  const ground = new THREE.Mesh( geometry, groundMAT );
  ground.position.x = 400;
  ground.position.y = 0;
  ground.position.z = 400;
  ground.scale.x = 7000;
  ground.scale.y = 10;
  ground.scale.z = 7000;
  ground.updateMatrix();
  // mesh.matrixAutoUpdate = false;
  scene.add( ground );

  const material1 = new THREE.MeshPhongMaterial( { color: 'red', flatShading: true } );
  const block1 = new THREE.Mesh( geometry, material1 );
  block1.position.x = -3000;
  block1.position.y = 10;
  block1.position.z = 3800;
  block1.scale.x = 50;
  block1.scale.y = 50;
  block1.scale.z = 50;
  block1.updateMatrix();
  scene.add( block1 );

  const material2 = new THREE.MeshPhongMaterial( { color: 'blue', flatShading: true } );
  const block2 = new THREE.Mesh( geometry, material2 );
  block2.position.x = -3000;
  block2.position.y = 10;
  block2.position.z = -3000;
  block2.scale.x = 50;
  block2.scale.y = 50;
  block2.scale.z = 50;
  block2.updateMatrix();
  scene.add( block2 );

  const material3 = new THREE.MeshPhongMaterial( { color: 'green', flatShading: true } );
  const block3 = new THREE.Mesh( geometry, material3 );
  block3.position.x = 3800;
  block3.position.y = 10;
  block3.position.z = 3800;
  block3.scale.x = 50;
  block3.scale.y = 50;
  block3.scale.z = 50;
  block3.updateMatrix();
  scene.add( block3 );

  const material4 = new THREE.MeshPhongMaterial( { color: 'yellow', flatShading: true } );
  const block4 = new THREE.Mesh( geometry, material4 );
  block4.position.x = 3800;
  block4.position.y = 10;
  block4.position.z = -3000;
  block4.scale.x = 50;
  block4.scale.y = 50;
  block4.scale.z = 50;
  block4.updateMatrix();
  scene.add( block4 );

// lights

const dirLight1 = new THREE.DirectionalLight( 0xffffff );
dirLight1.position.set( 5, 1, 1 );
scene.add( dirLight1 );


const ambientLight = new THREE.AmbientLight( 0x919191 );
scene.add( ambientLight );

//

domEvents.addEventListener(block3, 'click', function(event){
	console.log('green')
}, false)

domEvents.addEventListener(ground, 'click', function(event){
	console.log('ground')
}, false)


// Render Loop
function render() {
  requestAnimationFrame(render); 
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener( 'resize', onWindowResize, false );
render();

// Functions :

function onWindowResize() {
	  camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
}