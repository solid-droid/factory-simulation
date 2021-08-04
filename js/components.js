let assets = [];
let tree = [];
var components = [];

const createGround = () => {

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const groundMAT = new THREE.MeshPhongMaterial( { color: 0xdcdcdc, flatShading: true } );
    const ground = new THREE.Mesh( geometry, groundMAT );

    ground.position.x = 400;
    ground.position.y = 0;
    ground.position.z = 400;
    ground.scale.x = 7000;
    ground.scale.y = 10;
    ground.scale.z = 7000;
    scene.add( ground );


}
const offset = {x : -3000 , y:10 , z:3800};
const createCuboid = ({
    l = 50 , w = 50 , h = 50,
    color = 'red'
    }) => {
        const geometry = new THREE.BoxGeometry( l, h, w );
        const material1 = new THREE.MeshPhongMaterial( { color , flatShading: true } );
        const block = new THREE.Mesh( geometry, material1 );
        block.position.x = offset.x;
        block.position.y = offset.y;
        block.position.z = offset.z;
        scene.add( block );
        return block;
};

const createCube = ( x = -3000 , y=10 , z=3800 , size = 50 , color = 'red' ) => {

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material1 = new THREE.MeshPhongMaterial( { color , flatShading: true } );
    const block = new THREE.Mesh( geometry, material1 );
    block.position.x = x;
    block.position.y = y;
    block.position.z = z;
    block.scale.x = size;
    block.scale.y = size;
    block.scale.z = size;
    scene.add( block);
    return block;
};

const loadComponents = (plant)=>{
    switch(plant) {

        case 'TC04A' : loadLTP(); break;
    }
};

const loadLTP = () => {
    const getList = (data) => {
        let node = {...data}
        delete node.children;
        tree.push(node);
        if(data.children){
            data.children.forEach(node => {
                getList(node);
            });
        }
    };

    getList(ltp);
    assets = tree.filter(x => x.hierarchyType == 'Station');
    loadAssets();
};

const loadAssets = () => {

   const gantry = assets.filter(x => x.device == 'Gantry');
   const robot = assets.filter(x => x.device == 'Robot');
   
   ////////Build Gantry///////
   loadGantry(gantry);
   loadRobot(robot);

}

const loadGantry = (list) => {

    list.forEach((x ,i) => {
     let machine = {}
     machine['path'] = x.path;
     let gantry = {};
     gantry ={w : 500 + i * 1000};
     machine['block'] = createCuboid(gantry);
     machine.block.translateZ(-(500 + i * 1000)/2);

     components.push(machine);

    });

    console.log(components);

};

const loadRobot = (list) => {


}