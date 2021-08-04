
 
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
plantSelect.setValue(1);

///////////////////////////////////////////////////////


var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xeeeeee );
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000000);
renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
var controls = new THREE.OrbitControls(camera, renderer.domElement);
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
document.getElementById("canvas").appendChild(renderer.domElement);

var domEvents	= new THREEx.DomEvents(camera, renderer.domElement)

camera.position.x = 8000;
camera.position.y = 5000;
camera.position.z = 0;


// world


// geometry.translate( 0, 0.5, 0 );

createGround();

createCube(-3000,10,3800,50,'red');
createCube(-3000,10,-3000,50,'blue');
createCube(3800,10,3800,50, 'green');
createCube(3800,10,-3000,50,'yellow');

loadComponents('TC04A');

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