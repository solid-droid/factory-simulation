
 
  var $select = $('#plant').selectize({
      sortField: 'text',
      create: false,
      maxItems: 1,
      delimiter: ',',
      persist: false,
  });
  var plantSelect = $select[0].selectize;
  if(window.innerWidth < 1024){
    plantSelect.addOption([{
            text: 'TC04A',
            value: 1
        },
        {
          text: 'EE01A',
            value: 2
        }]);
} else {
  plantSelect.addOption([{
          text: 'Livonia Transmission Plant - TC04A',
          value: 1
      },
      {
        text: 'Advanced Manufacturing Center - EE01A',
          value: 2
      }]);
}
plantSelect.setValue(2);

///////////////////////////////////////////////////////


var scene = new THREE.Scene();
var clock = new THREE.Clock();
var robot1 , car;
var mixers = [];
scene.background = new THREE.Color( 0xeeeeee );
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100000);
renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
renderer.setPixelRatio(DPR);
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.mouseButtons = {
    ORBIT: THREE.MOUSE.RIGHT,
    ZOOM: THREE.MOUSE.MIDDLE,
    PAN: THREE.MOUSE.LEFT
  };
controls.minDistance  =2000;
controls.maxDistance  = 10000;
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
document.getElementById("canvas").appendChild(renderer.domElement);

var domEvents	= new THREEx.DomEvents(camera, renderer.domElement)

// camera.position.x = 6500;
// camera.position.y = 3000;
// camera.position.z = 100;

var camera_pivot = new THREE.Object3D()
var Zaxis = new THREE.Vector3( 0, 0, 1 );
var Yaxis = new THREE.Vector3( 0, 1, 0 );

scene.add( camera_pivot );
camera_pivot.add( camera );
camera.lookAt( camera_pivot.position );
camera_pivot.rotateOnAxis( Zaxis,0.05);
camera_pivot.rotateOnAxis( Yaxis, 0.465);
camera.position.set( 6000, 3000, 3000 );


// world

createGround();

// createCube(-3000,30,3800,50,'red');
// createCube(-3000,30,-3000,50,'blue');
// createCube(3800,30,3800,50, 'green');
// createCube(3800,30,-3000,50,'yellow');

var loader = new THREE.GLTFLoader();
loader.crossOrigin = true;
loader.load( './3dModels/robot1/scene.gltf', gltf => {
    robot1 = gltf;  
loader.load( './3dModels/car1/scene.gltf', gltf => {
      car = gltf;  
      loadComponents('EE01A');
 }); 
}); 


// lights

const dirLight1 = new THREE.DirectionalLight( 0xffffff );
dirLight1.position.set( 5, 1, 1 );
scene.add( dirLight1 );


const ambientLight = new THREE.AmbientLight( 0x919191 );
scene.add( ambientLight );

//




// Render Loop
function render() {
  requestAnimationFrame(render); 
  var delta = clock.getDelta();
  mixers.forEach(mixer => mixer.update( delta ));
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
    plantSelect.clearOptions();
    if(window.innerWidth < 1024){
      plantSelect.addOption([{
              text: 'TC04A',
              value: 1
          },
          {
            text: 'EE01A',
              value: 2
          }]);
    } else {
      plantSelect.addOption([{
            text: 'Livonia Transmission Plant - TC04A',
            value: 1
        },
        {
          text: 'Advanced Manufacturing Center - EE01A',
            value: 2
        }]);
    }
    plantSelect.setValue(1);
}