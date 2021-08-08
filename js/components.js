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

const createEdge = (geometry) => {
    material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 4 } );
    geometry = new THREE.EdgesGeometry(geometry);
    wireframe = new THREE.LineSegments( geometry, material  );
    wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
    return wireframe;

}

const createCuboid = ({
    l = 50 , w = 50 , h = 50,
    color = '#b6cfec' 
    }) => {
        const offset = {x : -3000 , y:41 , z:3800};
        const geometry = new THREE.BoxGeometry( l, h, w );
        const material = new THREE.MeshPhongMaterial( { color , flatShading: true } ); 
        const block = new THREE.Mesh( geometry, material);
        block.position.x = offset.x;
        block.position.y = offset.y + h/2 - 10;
        block.position.z = offset.z;
        const edge = createEdge(geometry);
        return {block,edge};
};

const createCube = ( x = 0 , y= 0 , z= 0 , size = 50 , color = 'red' ) => {

    const offset = { x : -3000 , y:20 , z: -3800};
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshPhongMaterial( { color , flatShading: true } );
    const block = new THREE.Mesh( geometry, material );
    block.position.x = x + offset.x;
    block.position.y = y + offset.y;
    block.position.z = z - offset.z;
    block.scale.x = size;
    block.scale.y = size;
    block.scale.z = size;
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


const loadAMC = async () => {
    getList(amc);
    const WorkStation = tree.filter(x => x.hierarchyType === 'WorkStation');
    const Equipment = tree.filter(x => x.hierarchyType === 'Equipment');
    const Line = tree. filter(x => x.hierarchyType === 'Line');
    loadLine(Line);
    loadWorkStation(WorkStation, Line);
    loadRobot(Equipment, Line);
    loadAMV(Line);
    setInterval(() => loadAMV(Line) , 5000);




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
        entry['block'] = createCuboid(dimension).block;

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
            entry['block'] = createCuboid(dimension).block;

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
            entry['block'] = createCuboid(dimension).block;
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
     machine['block'] = createCuboid(gantry).block;
     
     machine.block.translateZ();

     components.push(machine);

    });

    console.log(components);

};

const createRobot = (model,x=0,y=0,z=0,rot=0) => {
    model.scene.position.set(-3000+x, 40+y, 3000-z);
    const size = 60;
    model.scene.scale.x = size;
    model.scene.scale.y = size;
    model.scene.scale.z = size;
    model.scene.rotateY(rot);
    scene.add( model.scene );
    mixer = new THREE.AnimationMixer( model.scene );
    mixers.push(mixer);
    const action = mixer.clipAction( model.animations[ 0 ] ); // access first animation clip
    action.play();
}

const cloneGltf = (gltf) => {
    const clone = {
      animations: gltf.animations,
      scene: gltf.scene.clone(true)
    };
  
    const skinnedMeshes = {};
  
    gltf.scene.traverse(node => {
      if (node.isSkinnedMesh) {
        skinnedMeshes[node.name] = node;
      }
    });
  
    const cloneBones = {};
    const cloneSkinnedMeshes = {};
  
    clone.scene.traverse(node => {
      if (node.isBone) {
        cloneBones[node.name] = node;
      }
  
      if (node.isSkinnedMesh) {
        cloneSkinnedMeshes[node.name] = node;
      }
    });
  
    for (let name in skinnedMeshes) {
      const skinnedMesh = skinnedMeshes[name];
      const skeleton = skinnedMesh.skeleton;
      const cloneSkinnedMesh = cloneSkinnedMeshes[name];
  
      const orderedCloneBones = [];
  
      for (let i = 0; i < skeleton.bones.length; ++i) {
        const cloneBone = cloneBones[skeleton.bones[i].name];
        orderedCloneBones.push(cloneBone);
      }
  
      cloneSkinnedMesh.bind(
          new Skeleton(orderedCloneBones, skeleton.boneInverses),
          cloneSkinnedMesh.matrixWorld);
    }
  
    return clone;
  }

const loadRobot = async (list, Line) => {
const offsetL = Line.length*3;
const lineWidth = totalW / offsetL ;
const workStationWidth = lineWidth/2;
let lineCounter = 0;
let x , z , rot = 0 , offset = 0;
   list.forEach(x=>{

    // const {block, edge} = createCuboid({l : workStationWidth * 2 , w  : workStationWidth , h : workStationWidth*3/2 , color :'red'});
    if(lineCounter%2){
        // block.translateZ(-lineWidth *1.34 * lineCounter - lineWidth*1.65 );
        rot = 0;
        offset = 0;
        z=-lineWidth *1.35 * lineCounter - 100 ;
    } else {
        rot = Math.PI;
        offset = 500;
        // block.translateZ(-lineWidth *1.34 * lineCounter - lineWidth );
        z=-lineWidth *1.3 * lineCounter + 200;
    }
    switch(x.name){
        case 'Robot 1' : 
        // block.translateX(2*(totalW-lineWidth)/7 - workStationWidth);
        x = 2*(totalW-lineWidth)/7 - workStationWidth;
        break;
        case 'Robot 2' : 
        // block.translateX(3*(totalW-lineWidth)/7 - workStationWidth);
        x = 3*(totalW-lineWidth)/7 - workStationWidth;
        break;
        case 'Robot 3' : 
        // block.translateX(5*(totalW-lineWidth)/7);
        x = 5*(totalW-lineWidth)/7 - workStationWidth;
        break;
        case 'Robot 4' : 
        // block.translateX(6*(totalW-lineWidth)/7);
        x = 6*(totalW-lineWidth)/7 - workStationWidth;
        lineCounter++;
        break;
    }
    createRobot(cloneGltf(robot1),x+offset,0,-z,rot);
    // scene.add( block);
   });

}

const loadWorkStation = (list , Line) => {
    const offsetL = Line.length*3;
    const lineWidth = totalW / offsetL ;
    const workStationWidth = lineWidth/2;
    let prevLine = '';
    let lineCounter = 0;
    list.forEach(ws => {
        const currLine = ws.path.split('/')[3];
        const {block, edge} = createCuboid({l : workStationWidth * 2 , w  : workStationWidth , h : workStationWidth*3/2 , color :'blue'});
        if(prevLine !== currLine){
            prevLine = currLine;
            block.translateZ(-lineWidth * 2.65 * lineCounter - lineWidth);
         } else {
            block.translateZ(-lineWidth * 2.67 * lineCounter - lineWidth * 3);
            lineCounter++;
        }
        if(block) {
        block.translateX(totalW/2);
        scene.add( block);
        block.add(edge);
        }
    });

};

const createCar = (model,x=0,y=150,z=0,rot=0) => {
    model.scene.position.set(-3000+x, 40+y, 3000-z);
    const size = 70;
    model.scene.scale.x = size;
    model.scene.scale.y = size;
    model.scene.scale.z = size;
    model.scene.rotateX(- Math.PI/2);
    let newMaterial = new THREE.MeshStandardMaterial({color: 0x868686});
    model.scene.traverse((o) => {
    if (o.isMesh) o.material = newMaterial;
    });
    scene.add( model.scene );
    return model.scene;
}


const loadAMV = async line => {
    const lineWidth = totalW / (line.length*2 + 1);
    const model = createCar(cloneGltf(car),totalW-70,150,-500);

    TweenMax.to( model.position, 3, {z : model.position.z - lineWidth, onComplete:()=> moveUp(model , lineWidth ,line.length , 1)});
    

};

const moveUp = (model, lineWidth, totalLines , currentLine , x = 0) => {
    x++;
    TweenMax.to( model.position, 2, {x : model.position.x - lineWidth, onComplete: () => 
        x < 8 ? moveUp(model,lineWidth,totalLines , currentLine, x) : moveRight(model, lineWidth, totalLines , currentLine) })
}

const moveRight = (model, lineWidth, totalLines , currentLine, x = 0) => {
    currentLine++;
    TweenMax.to( model.position, 3, {z : model.position.z - 2*lineWidth, onComplete: () => 
        currentLine <= totalLines ? 
            currentLine % 2 ? 
                moveUp(model, lineWidth,totalLines , currentLine) 
            :   moveDown(model, lineWidth,totalLines , currentLine) 
        :   scene.remove( model ) });
}

const moveDown = (model, lineWidth,totalLines , currentLine, x = 0) => {
    x++;
    TweenMax.to( model.position, 2, {x : model.position.x + lineWidth, onComplete: () => 
        x < 8 ? moveDown(model,lineWidth,totalLines , currentLine, x) : moveRight(model, lineWidth, totalLines , currentLine) })

};