var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcccccc );
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
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


camera.position.x = 1041;
camera.position.y = 300;
camera.position.z = 1082;
camera.rotation.x = -0.75;
camera.rotation.y = 0.6;
camera.rotation.z= 0.49;

// world

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
geometry.translate( 0, 0.5, 0 );
const material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

for ( let i = 0; i < 500; i ++ ) {

  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.x = Math.random() * 1600 - 800;
  mesh.position.y = 0;
  mesh.position.z = Math.random() * 1600 - 800;
  mesh.scale.x = 20;
  mesh.scale.y = Math.random() * 80 + 10;
  mesh.scale.z = 20;
  mesh.updateMatrix();
  mesh.matrixAutoUpdate = false;
  scene.add( mesh );

}

// lights

const dirLight1 = new THREE.DirectionalLight( 0xffffff );
dirLight1.position.set( 10, 1, 1 );
scene.add( dirLight1 );

// const dirLight2 = new THREE.DirectionalLight( 0x002288 );
// dirLight2.position.set( - 1, - 1, - 1 );
// scene.add( dirLight2 );

const ambientLight = new THREE.AmbientLight( 0x222222 );
scene.add( ambientLight );

//

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


//See Also:

//https://threejs.org/docs/#Reference/Materials/Material
//https://threejs.org/docs/#Reference/Textures/Texture