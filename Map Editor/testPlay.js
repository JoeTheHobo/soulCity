//Set Up Variables
let data = decodeFile(ls.get('scTestPlayer'));
let canvas = $('player');
let ctx = canvas.getContext('2d');
let doDrawMechs = false;
let doGridLines = false;
let player = {
    speed: 0,
    moving: {
        left: false,
        right: false,
        down: false,
        up: false,
    },
    tile: {
        x: 0,
        y: 0,
    },
    pos: {
        x: 0,
        y: 0,
    },
    img: false,
}

//Functions
function start() {
    //Load All Images
    loadAllImages();

    //Set Canvas Size
    setCanvasSize();

    //Set Up Player
    setUpPlayer();

    //Start Canvas Loop
    startLoop();
}
function startLoop() {
    setInterval(function() {
        //Reset Canvas
        ctx.fillStyle = '#444';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        //Move Player
        if (player) movePlayer();

        //Draw Everything
        drawEverything(canvas,data,player ? player : false);


    },1000/60)
}
function movePlayer() {
    moveLeft: if (player.moving.left) {
        let playerLeft = Math.round(((player.pos.x-(canvas.tileSize/2)) - player.speed) / canvas.tileSize); 
        let inverseX = (data[0].length-1) - playerLeft;
        let inverseY = (data.length-1) - player.tile.y;
        let speedInverseX = (data[0].length-1) - player.tile.x;

        //Check If Will Walk Off Sceen
        if (playerLeft < 0) break moveLeft;

        //Check If Can't Move On Tile
        if (!data[inverseY][inverseX].tile.walkable) break moveLeft;

        //Change Speed Modifier
        let speed = player.speed * data[inverseY][speedInverseX].tile.speed;

        player.pos.x -= speed;
    }
    moveRight: if (player.moving.right) {
        let playerRight = Math.round(((player.pos.x+(canvas.tileSize/2)) + player.speed) / canvas.tileSize); 
        let inverseX = (data[0].length-1) - playerRight;
        let inverseY = (data.length-1) - player.tile.y;
        let speedInverseX = (data[0].length-1) - player.tile.x;

        //Check If Will Walk Off Sceen
        if (playerRight > data[0].length - 1) break moveRight;

        //Check If Can't Move On Tile
        if (!data[inverseY][inverseX].tile.walkable) break moveRight;

        //Change Speed Modifier
        let speed = player.speed * data[inverseY][speedInverseX].tile.speed;

        player.pos.x += speed;
    }
    moveDown: if (player.moving.down) {
        let playerDown = Math.round(((player.pos.y+(canvas.tileSize/2)) + player.speed) / canvas.tileSize); 
        let inverseY = (data.length-1) - playerDown;
        let inverseX = (data[0].length-1) - player.tile.x;
        let speedInverseY = (data.length-1) - player.tile.y;

        //Check If Will Walk Off Sceen
        if (playerDown > data.length - 1) break moveDown;

        //Check If Can't Move On Tile
        if (!data[inverseY][inverseX].tile.walkable) break moveDown;

        //Change Speed Modifier
        let speed = player.speed * data[speedInverseY][inverseX].tile.speed;

        player.pos.y += speed;
    }
    moveUp: if (player.moving.up) {
        let playerDown = Math.round(((player.pos.y-(canvas.tileSize/2)) + player.speed) / canvas.tileSize); 
        let inverseY = (data.length-1) - playerDown;
        let inverseX = (data[0].length-1) - player.tile.x;
        let speedInverseY = (data.length-1) - player.tile.y;

        //Check If Will Walk Off Sceen
        if (playerDown < 0) break moveUp;

        //Check If Can't Move On Tile
        if (!data[inverseY][inverseX].tile.walkable) break moveUp;

        //Change Speed Modifier
        let speed = player.speed * data[speedInverseY][inverseX].tile.speed;

        player.pos.y -= speed;
    }

    player.tile.x = Math.round(player.pos.x / canvas.tileSize)
    player.tile.y = Math.round(player.pos.y / canvas.tileSize)
}
function setUpPlayer() {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j].mech.testPlayFromHere) {
                player.pos.x = (((data[i].length-1)-j)*canvas.tileSize)// + (canvas.tileSize/2);
                player.pos.y = (((data.length-1)-i)*canvas.tileSize)// + (canvas.tileSize/2);
                player.tile.x = j;
                player.tile.y = i;
                player.img = data[i][j].mech.id;
                player.speed = data[i][j].mech.speed;
                return;
            }
        }
    }
    player = false;
}

function setCanvasSize() {
    let windowHeight = window.innerHeight;
    canvas.width = windowHeight;
    canvas.height = windowHeight;
    canvas.style.width = windowHeight + 'px';
    canvas.style.height = windowHeight + 'px';

    canvas.tileSize = Math.round(windowHeight / data.length);
}

function goBackToEditor() {
    
    let testPlayer = window.open("./mapEditor.html","_self")
}
//Finished Functions and Start
start();
//Interactive Window

window.addEventListener('resize',function(e) {
    setCanvasSize();
})

window.addEventListener('keydown',function(e) {
    let key = e.key;
    let lkey = e.key.toLowerCase(); //Key but in lowercase no matter what 

    if (lkey == 'escape') {
        goBackToEditor();
    }

    if (lkey == 'a') player.moving.left = true;
    if (lkey == 's') player.moving.down = true;
    if (lkey == 'd') player.moving.right = true;
    if (lkey == 'w') player.moving.up = true;
})
window.addEventListener('keyup',function(e) {
    let key = e.key;
    let lkey = e.key.toLowerCase(); //Key but in lowercase no matter what 


    if (lkey == 'a') player.moving.left = false;
    if (lkey == 's') player.moving.down = false;
    if (lkey == 'd') player.moving.right = false;
    if (lkey == 'w') player.moving.up = false;
})