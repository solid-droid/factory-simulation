const mouseClick = (block)=>{
    $('#tooltip').html(`
    <div class="name">${block.name}</div>
    <div class="path">${block.path}</div>
    `);
    $('#tooltip').show();
    $('#tooltip').css({top : event.clientY+10, left : event.clientX+30});
    
};

const partClick = (block)=>{
    $('#tooltip').html(`
    <div class="name">Partype : '</div>
    <div class="path">${block.path}</div>
    `);
    $('#tooltip').show();
    $('#tooltip').css({top : event.clientY, left : event.clientX});
};

const mouseOut = (block)=>{
    $('#tooltip').hide();
};