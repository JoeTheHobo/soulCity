//Variables
let mapSize = 20;

//Functions

function decodeFile(file) {
    let map = file.split('/');
    for (let i = 0; i < map.length; i++) {
        map[i] = map[i].split(',')
    }
    let newMap = [];
    for (let i = 0; i < map.length; i++) {
        let row = [];
        for (let j = 0; j < map[0].length; j++) {
            let cell = map[i][j].split('-');
            row.push({
                tile: returnObj('tile',cell[0]),
                space: returnObj('space',cell[1]),
                top: returnObj('top',cell[2]),
                mech: returnObj('mech',cell[3])
            });
        }
        newMap.push(row)
    }
    return newMap;
}

function returnObj(type,id) {
    if (type == 'tile') {
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].id == id) return tiles[i];
        }
    }
    if (type == 'space') {
        for (let i = 0; i < spaces.length; i++) {
            if (spaces[i].id == id) return spaces[i];
        }
    }
    if (type == 'top') {
        for (let i = 0; i < tops.length; i++) {
            if (tops[i].id == id) return tops[i];
        }
    }
    if (type == 'mech') {
        for (let i = 0; i < mechs.length; i++) {
            if (mechs[i].id == id) return mechs[i];
        }
    }
}

function loadAllImages() {
    window.count = 0;
    window.finishedLoadingImages = false;
    let images = document.body.create('div');
    images.css({
        position: "absolute",
        top: "1000px",
    })

    for (let i = 0; i < tiles.length; i++) {
        if (!tiles[i].img) continue;
        window.count++;
        let img = images.create('img');
        img.src = '../img/' + tiles[i].img + '.png';
        img.id = 'imgTile' + tiles[i].id;
        img.onload = function() {
            window.count--;
            if (window.count === 0) 
                window.finishedLoadingImages = true;
        }
    }
    for (let i = 0; i < spaces.length; i++) {
        if (!spaces[i].img) continue;
        window.count++;

        let img = images.create('img');
        img.src = '../img/' + spaces[i].img + '.png';
        img.id = 'imgSpace' + spaces[i].id;

        img.onload = function() {
            window.count--;
            if (window.count === 0) 
                window.finishedLoadingImages = true;
        }
    }
    for (let i = 0; i < tops.length; i++) {
        if (!tops[i].img) continue;
        window.count++;

        let img = images.create('img');
        img.src = '../img/' + tops[i].img + '.png';
        img.id = 'imgTop' + tops[i].id;

        img.onload = function() {
            window.count--;
            if (window.count === 0) 
                window.finishedLoadingImages = true; 
        }
    }
    for (let i = 0; i < mechs.length; i++) {
        if (!mechs[i].img) continue;
        window.count++;

        let img = images.create('img');
        img.src = '../img/' + mechs[i].img + '.png';
        img.id = 'imgMech' + mechs[i].id;

        img.onload = function() {
            window.count--;
            if (window.count === 0) 
                window.finishedLoadingImages = true; 
        }
    }
}


function drawEverything(canvas,data,doPlayer = false, doMechs = doDrawMechs,doGrid = doGridLines,color = false,doSpaces = true, doTops = true) {
    let tileSize = Math.round(canvas.offsetWidth / data.length);

    //Draw Tiles
    drawTiles(canvas,data,tileSize,color);
    //Draw Spaces
    if (doSpaces) drawSpaces(canvas,data,tileSize,color);
    //Draw Player
    if (doPlayer) drawPlayer(canvas,doPlayer,tileSize,color);
    //Draw Tops
    if (doTops) drawTops(canvas,data,tileSize,color);
    //Draw Mechs If True
    if (doMechs) drawMechs(canvas,data,tileSize,color);
    //Draw Grid Lines if true
    if (doGrid) drawGridLines(canvas,data,tileSize,color);
}

function drawPlayer(canvas,player,tileSize,color) {
    ctx = canvas.getContext('2d');
    ctx.drawImage($('imgMech' + player.img),player.pos.x,player.pos.y,tileSize,tileSize)
}
function drawGridLines(canvas,data,tileSize,color) {
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    for (let i = 0; i < data.length; i++) {
        ctx.beginPath();
        ctx.moveTo(0,i * tileSize);
        ctx.lineTo(canvas.width,i * tileSize);
        ctx.stroke();
    }
    for (let j = 0; j < data[0].length; j++) {
        ctx.beginPath();
        ctx.moveTo(j * tileSize,0);
        ctx.lineTo(j * tileSize,canvas.height);
        ctx.stroke();
    }
}
function drawTiles(canvas,data,tileSize,color) {
    ctx = canvas.getContext('2d');

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let tile = data[i][j].tile;
            ctx.fillStyle = tile.color;
            if (!color) ctx.drawImage($('imgTile' + tile.id),((data.length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize)
            else if(tile.draw) ctx.fillRect(((data.length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize);
        }
    }
}
function drawSpaces(canvas,data,tileSize,color) {
    ctx = canvas.getContext('2d');
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let tile = data[i][j].space;
            ctx.fillStyle = tile.color;
            if (!color) ctx.drawImage($('imgSpace' + tile.id),((data.length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize)
            else if(tile.draw) ctx.fillRect(((data.length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize);
        }
    }
}
function drawTops(canvas,data,tileSize,color) {
    ctx = canvas.getContext('2d');
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let tile = data[i][j].top;
            ctx.fillStyle = tile.color;
            if (!color) ctx.drawImage($('imgTop' + tile.id),((data.length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize)
            else if(tile.draw) ctx.fillRect(((data.length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize);
        }
    }
}
function drawMechs(canvas,data,tileSize,color) {
    ctx = canvas.getContext('2d');
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let tile = data[i][j].mech;
            ctx.fillStyle = tile.color;
            if (!color) ctx.drawImage($('imgMech' + tile.id),((data.length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize)
            else if(tile.draw) ctx.fillRect(((data.length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize);
        }
    }
}