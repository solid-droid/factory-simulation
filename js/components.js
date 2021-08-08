let tree = [];
var components = [];

const createGround = () => {

    var geo = new THREE.PlaneBufferGeometry(7000, 7000);
    var mat = new THREE.MeshBasicMaterial({ color: 0x8c8383, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geo, mat);
    plane.rotateX( - Math.PI / 2);
    plane.position.x = 400;
    plane.position.z = 400;
    plane.position.y = -30;
    scene.add(plane);
    


}

const createCuboid = ({
    l = 50 , w = 50 , h = 50,
    color = 'red' 
    }) => {
        const offset = {x : -3000 , y:41 , z:3800};
        const geometry = new THREE.BoxGeometry( l, h, w );
        const material = new THREE.MeshPhongMaterial( { color , flatShading: true } ); 
        const block = new THREE.Mesh( geometry, material);
        block.position.x = offset.x;
        block.position.y = offset.y + h/2 - 10;
        block.position.z = offset.z;
        return block;
};

const createCube = ( x = -3000 , y=20 , z=3800 , size = 50 , color = 'red' ) => {

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshPhongMaterial( { color , flatShading: true } );
    const block = new THREE.Mesh( geometry, material );
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
        case 'EE01A' : loadAMC(); break;
    }
};



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

const loadAMC = () => {
    getList(amc);
    const WorkStation = tree.filter(x => x.hierarchyType === 'WorkStation');
    const Equipment = tree.filter(x => x.hierarchyType === 'Equipment');
    const Line = tree. filter(x => x.hierarchyType === 'Line');
    loadLine(Line);
    loadWorkStation(WorkStation, Line.length);
};

const loadLTP = () => {
    getList(ltp);
};


///////////////////////////---Types Of Assets---///////////////////////////////////////
const totalW = 6850;
const loadLine = (list) => {
    const lineWidth = totalW / (list.length*2 + 1);
    //lines
    list.forEach((line, i) => {
        let entry = {}
        entry['path'] = line.path;
        const dimension ={w : lineWidth , l : totalW};
        const offset ={z : -dimension.w/2, x : totalW/2 , y: 0};
        entry['block'] = createCuboid(dimension);

        entry.block.translateZ(offset.z - i * lineWidth * 2 - lineWidth);
        entry.block.translateX(offset.x);

        components.push(entry);
        scene.add( entry.block);
    });
    //line turns
    list.forEach((line, i) => {
        if(i < list.length -1){
            let entry = {}
            entry['path'] = line.path;
            const dimension ={w : lineWidth , l : lineWidth};
            const offset ={z : -dimension.w*3/2, x : 0 , y: 0};
            entry['block'] = createCuboid(dimension);

            entry.block.translateZ(offset.z - i * lineWidth * 2 - lineWidth);
            if(i%2){
                entry.block.translateX(totalW - lineWidth/2);
            } else {
                entry.block.translateX(lineWidth/2);
            }
            components.push(entry);
            scene.add( entry.block);
        }
    });

    //Start and endPoint
    for(let i = 0; i < 2; i++){
            let entry = {}
            const dimension ={w : lineWidth , l : lineWidth};
            const offset ={z : -dimension.w*3/2, x : 0 , y: 0};
            entry['block'] = createCuboid(dimension);
            if(i%2){
                entry['path'] = list[0].path;
                entry.block.translateZ(offset.z + lineWidth);
                entry.block.translateX(totalW - lineWidth/2);
            } else {
                entry['path'] = list[list.length-1].path;
                entry.block.translateZ(offset.z - list.length * lineWidth * 2 + lineWidth);
                if(list.length%2){
                    entry.block.translateX(lineWidth/2);
                } else {
                    entry.block.translateX(totalW - lineWidth/2);
                }
            }
            components.push(entry);
            scene.add( entry.block);
    }

}

const loadGantry = (list) => {

    list.forEach((x ,i) => {
     let machine = {}
     machine['path'] = x.path;
     let gantry = {};
     gantry ={w : 500 + i * 1000 , };
     const offset ={z : -gantry.w/2, x : 0 , y: 0};
     machine['block'] = createCuboid(gantry);
     
     machine.block.translateZ();

     components.push(machine);

    });

    console.log(components);

};

const loadRobot = (list) => {


}

const loadWorkStation = (list , lineCount) => {
    console.log(list);

};

const loadAMV = (list) => {

};