let assets = [];
let gantry = [];
let tree = [];

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

const createCube = ( x = -3000 , y=10 , z=3800 , size = 50 , color = 'red' ) => {

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material1 = new THREE.MeshPhongMaterial( { color , flatShading: true } );
    const block1 = new THREE.Mesh( geometry, material1 );
    block1.position.x = x;
    block1.position.y = y;
    block1.position.z = z;
    block1.scale.x = size;
    block1.scale.y = size;
    block1.scale.z = size;
    scene.add( block1 );
};

const loadComponents = (plant)=>{
    switch(plant) {

        case 'TC04A' : loadLTP(); break;
    }
};

const loadLTP = () => {
    const getList = (data) => {
        tree.push({name: data.name, type: data.hierarchyType, path: data.path});
        if(data.children){
            data.children.forEach(node => {
                getList(node);
            });
        }
    };

    getList(ltp);
    console.log(tree);
};