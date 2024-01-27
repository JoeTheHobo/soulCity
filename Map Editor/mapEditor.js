////////////////////////
//  Needed Variables  //
////////////////////////

let htmlMap = $('map');
let map;
let maps = [];
let currentMap = 0;
let showGrid = true;
let shiftDown = false;
let controlDown = false;
let rotation = 'down';
let mouseDown =  false;


///////////////////
// End Variables //
/////////////////////
// Start Functions //
/////////////////////

function checkLoaded() {
    if(finishedLoadingImages === false) {
       window.setTimeout(checkLoaded, 0); /* this checks the flag every 100 milliseconds*/
    } else {
        start();
    }
}

function loadImagesFirst() {
    //Load Images
    loadAllImages();

    checkLoaded();
}
//Order Of Events.
function start() {

    //Update Maps From Cookies
    maps = ls.get('SCmaps',false) ? decodeAll(ls.get('SCmaps',false)) : [];

    //Create Empty Map if None Found
    if (maps.length < 1) {
        maps.push({
            name: "Untitled 1",
            data: makeMap(mapSize,mapSize)
        });
    }

    //Set Current Map
    
    currentMap = ls.get('scCurrentMap',false) ? ls.get('scCurrentMap',false) : maps[0].name;
    ls.save('scCurrentMap',false);

    //Loads Saved Maps
    loadMaps();

    //Draw Map
    let number = findMapByName(currentMap);
    createMap(maps[number].data);

    //Create Tile Options
    createOptions();

    //Switch to correct Tab
    switchTab('Tiles');

    //Load Inspecor
    loadTileInspector();

    //Fix Map Size
    fixMapSize();
}

function findMapByName(name) {
    for (let i = 0; i < maps.length; i++) {
        if (maps[i].name === name) return i;
    }
}

function createOptions() {
    let list = [['allTiles',tiles],['allSpaces',spaces],['allTops',tops],['allMechs',mechs]];
    for (let j = 0; j < list.length; j++) {
        let html = $(list[j][0]);
        let clist = list[j][1];

        html.innerHTML = '';
        for (let i = 0; i < clist.length; i++) {
            let div = html.create('div');
            div.id = 'optholder';
            div.tile = i;
            div.type = clist[i].type;

            let imgHolder = div.create('div');
            imgHolder.id = 'optimgHolder';
            imgHolder.style.background = clist[i].color;
            if (clist[i].img) {
                let img = imgHolder.create('img');
                img.src = '../img/' + clist[i].img + '.png';
                if (selectedCell.name == clist[i].name && selectedCell.type == clist[i].type) {
                }
            }
            
            if (selectedCell.name == clist[i].name && selectedCell.type == clist[i].type) {
                
                //imgHolder.style.transform = 'rotate(90deg)' 
                div.style.background = 'lightblue';
            }


            let text = div.create('div');
            text.id ='opttext';
            text.innerHTML = clist[i].name;

            div.onclick = function() {
                selectedCell = clist[this.tile];
                loadTileInspector();
                createOptions();
                rotation = 'down';

                if (this.type == 'tile') $('rsbrFillTiles').style.display = 'block';
                else $('rsbrFillTiles').style.display = 'none';
            }
        }
    }
}
function loadAttributes() {
    let body = $('rsblaBody');
    body.innerHTML = '';

    if (selectedCell.color !== undefined) createAtr('Color',selectedCell.color,true);
    if (selectedCell.img !== undefined) createAtr('Image',selectedCell.img,true);
    if (selectedCell.walkable !== undefined) createAtr('Walkable',selectedCell.walkable,true);
    if (selectedCell.draw !== undefined) createAtr('Draw On Mini Maps',selectedCell.draw,true);
    if (selectedCell.testPlayFromHere !== undefined) createAtr('Test Play From Here',selectedCell.testPlayFromHere,true);
    if (selectedCell.teleport !== undefined) createAtr('Teleport',selectedCell.teleport,true);
    if (selectedCell.id !== undefined) createAtr('ID',selectedCell.id,false);
    if (selectedCell.name !== undefined) createAtr('Name',selectedCell.name,false);
    if (selectedCell.type !== undefined) createAtr('Type',selectedCell.type,false);
}
function createAtr(first,second,clickable) {
    let body = $('rsblaBody');
    let holder, div1, div2;

    holder = body.create('holder');
    holder.className = 'atrHolder';
    div1 = holder.create('div');
    div1.className = 'atrName';
    div1.innerHTML = first + ": ";
    div2 = holder.create('div');
    div2.className = clickable ? 'atrClick' : 'atrNoclick';
    div2.innerHTML = second;
}
function createMap(map) {
    htmlMap.innerHTML = '';
    for (let i = 0; i < map.length; i++) {
        let tr = htmlMap.insertRow(0);
        for (let j = 0; j < map[0].length; j++) {
            let tile = map[i][j];
            let cell = tr.insertCell(0);

            cell.tile = tile.tile;
            cell.space = tile.space;
            cell.mech = tile.mech;
            cell.top = tile.top;

            cell.id = 'i' + i + 'j' + j;
            cell.i = i;
            cell.j = j;

            loadTile(i,j);
            
            cell.onmousedown = function() {
                if (!selectedCell) return;

                if (selectedCell.type == 'tile') this.tile = selectedCell;
                if (selectedCell.type == 'space') this.space = selectedCell;
                if (selectedCell.type == 'mech') this.mech = selectedCell;
                if (selectedCell.type == 'top') this.top = selectedCell;

                loadTile(this.i,this.j)
                maps[findMapByName(currentMap)].data = converTableToAMap();
                ls.save('SCmaps',saveAll())

                drawEverything($("rsbrCanvas"),maps[findMapByName(currentMap)].data,false,false,false,true,false,false)
                drawEverything($("canvas" + fixNameForID(currentMap)),maps[findMapByName(currentMap)].data,false,false,false,true,false,false)
            }
            cell.onmouseover = function() {
                if (mouseDown) {
                    if (!selectedCell) return;

                    if (selectedCell.type == 'tile') this.tile = selectedCell;
                    if (selectedCell.type == 'space') this.space = selectedCell;
                    if (selectedCell.type == 'mech') this.mech = selectedCell;
                    if (selectedCell.type == 'top') this.top = selectedCell;

                    maps[findMapByName(currentMap)].data = converTableToAMap();
                    loadTile(this.i,this.j)
                    ls.save('SCmaps',saveAll())

                    drawEverything($("rsbrCanvas"),maps[findMapByName(currentMap)].data,false,false,false,true,false,false)
                    drawEverything($("canvas" + fixNameForID(currentMap)),maps[findMapByName(currentMap)].data,false,false,false,true,false,false)
                }
            }
        }
    }
    maps[findMapByName(currentMap)].data = converTableToAMap();
}
function fixNameForID(name) {
    let goodCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newName = '';
    for (let i = 0; i < name.length; i++) {
        if (goodCharacters.includes(name.charAt(i))) {
            newName += name.charAt(i);
        } else newName += 'azu';
    }
    return newName;
}
function loadTile(y,x) {
    let cell = $('i' + y + 'j' + x);
    let tile = cell.tile;
    let space = cell.space;
    let top = cell.top;
    let mech = cell.mech;

    let text = '';
    let otherText = '';
    if (mech.img) {
        text += 'url(../img/' + mech.img + '.png)';
        otherText += ', center center';
    }
    if (top.img) {
        text += ', url(../img/' + top.img + '.png)';
        otherText += ', center center';
    }
    if (space.img) {

        text += ', url(../img/' + space.img + '.png)';
        otherText += ', center center';
    }
    if (tile.img) {
        text += ', url(../img/' + tile.img + '.png)';
        otherText += 'center center';
    }
    
    cell.style.background = text;
    cell.style.backgroundPosition = otherText;
}

function makeMap(cols,rows) {
    let returnMap = [];
    for (let i = 0; i < rows; i++) {
        let returnRow = [];
        for (let j = 0; j < cols; j++) {
            returnRow.push({
                tile: tiles[2], //Grass
                space: spaces[0], //Air - Item/Space on Tile
                mech: mechs[0],
                top: tops[0],
            })
        }
        returnMap.push(returnRow);
    }
    return returnMap;
}

//Reset All Styles for Canvas/Text
function resetStyles() {

}


function switchTab(type) {
    let layer = 1;
    $('allTiles').style.display = 'none';
    $('allSpaces').style.display = 'none';
    $('allTops').style.display = 'none';
    $('allMechs').style.display = 'none';

    for (let i = 1; i < 5; i++) {
        $('header' + i).className = 'header plain';
    }

    if (type == 'Tiles') {
        layer = 1;
        $('allTiles').style.display = 'block';
        $('header1').className = 'header cool';
    }
    if (type == 'Spaces') {
        layer = 2;
        $('allSpaces').style.display = 'block';
        $('header2').className = 'header cool';
    }
    if (type == 'Tops') {
        layer = 3;
        $('allTops').style.display = 'block';
        $('header3').className = 'header cool';
    }
    if (type == 'Mechs') {
        layer = 4;
        $('allMechs').style.display = 'block';
        $('header4').className = 'header cool';
    }
    $('layer').innerHTML = 'Layer ' + layer;
}

function fixMapSize() {
    let htmlMap = $('map');
    let width = window.innerWidth - $('rightSide').offsetWidth;
    let height = window.innerHeight;

    let padding = 20;

    width -= padding;
    height -= padding;

    htmlMap.style.height = width < height ? width + 'px' : height + 'px';

    htmlMap.style.left = (($('body').offsetWidth - htmlMap.offsetWidth) / 2) + 'px';
    htmlMap.style.top = (($('body').offsetHeight - htmlMap.offsetHeight) / 2) + 'px';

}
function loadMaps() {
    $('savesList').innerHTML = '';
    for (let i = 0; i < maps.length; i++) {
        let holder = $('savesList').create('div');
        holder.id = 'savesHolder';
        holder.name = maps[i].name;

        if (currentMap == maps[i].name)
        holder.id = 'SelectedHolder';

        let canvas = holder.create('canvas');
        canvas.className = 'savesCanvas';
        canvas.id = 'canvas' + fixNameForID(maps[i].name);
        canvas.height = 40;
        canvas.width = 40;
        canvas.style.height = '40px';
        canvas.style.width = '40px';
        drawEverything(canvas,maps[i].data,false,false,false,true,false,false)

        let name = holder.create('div');
        name.id = 'savesName';
        name.innerHTML = maps[i].name;
        name.name = maps[i].name;
        holder.onclick = function() {
            currentMap = this.name;
            loadMaps();
            
            let number = findMapByName(currentMap);
            createMap(maps[number].data);
        }

    }
    //Save All Maps
    ls.save('SCmaps',saveAll())
    //Load Insport
    loadMapInspector();
    //Create Big Map
    let number = findMapByName(currentMap);
    createMap(maps[number].data);
}
function renameMap() {
    let newName = prompt('New Name');
    if (newName === null || newName === '') return;

    let number2 = 1;
    for (let i = 0; i < maps.length; i++) {
        if (maps[i].name === newName) number2++;
    } 
    if (number2 > 1) newName = newName + ' ' + number2;

    maps[findMapByName(currentMap)].name = newName;

    currentMap = newName;
    loadMaps();
}
function newMap() {
    let name = prompt('Name Of New Map')
    if (name === null) return;

    let number = 1;
    let number2 = 1;
    for (let i = 0; i < maps.length; i++) {
        if (maps[i].name.includes("Untitled")) number++;
        if (maps[i].name === name) number2++;
    } 
    if (name === '') name = "Untitled " + number;
    if (number2 > 1) name = name + ' ' + number2;
    maps.push({
        name: name,
        data: makeMap(mapSize,mapSize)
    });

    currentMap = name;
    loadMaps();
}

//Hard Save Single/Current Map
function saveMap() { 
    convertTableToMap();

    console.log(convertTableToMap());
}
function fillTiles() {
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            let cell = $('i' + i + 'j' + j);
            cell.tile = selectedCell;
            loadTile(i,j)
        }
    }
    
    maps[findMapByName(currentMap)].data = converTableToAMap();
    ls.save('SCmaps',saveAll())
    loadMaps();
}
function converTableToAMap() {
    let map = [];
    for (let i = 0; i < mapSize; i++) {
        let row = [];
        for (let j = 0; j < mapSize; j++) {
            let cell = $('i' + i + 'j' + j);
            row.push({
                tile: cell.tile,
                space: cell.space,
                top: cell.top,
                mech: cell.mech,
            })
        }
        map.push(row)
    }
    return map;
}
function convertTableToMap() {
    //Convert Table to a map
    let string = '';
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            let cell = $('i' + i + 'j' + j);
            string += cell.tile.id;
            string += '-';
            string += cell.space.id;
            string += '-';
            string += cell.top.id;
            string += '-';
            string += cell.mech.id;
            if (j < mapSize-1) string += ',';
        }
        if (i < mapSize-1) string += "/"
    }
    return string;
}
function convertSaveObjectToString(save) {
    let string = '';
    for (let i = 0; i < save.length; i++) {
        for (let j = 0; j < save.length; j++) {
            let cell = $('i' + i + 'j' + j);
            string += save[i][j].tile.id;
            string += '-';
            string += save[i][j].space.id;
            string += '-';
            string += save[i][j].top.id;
            string += '-';
            string += save[i][j].mech.id;
            if (j < mapSize-1) string += ',';
        }
        if (i < mapSize-1) string += "/"
    }
    return string;
}
function saveAll() {
    let fullString = '';
    for (let i = 0; i < maps.length; i++) {
        fullString += maps[i].name + "}{|" + convertSaveObjectToString(maps[i].data);
        if (i < maps.length - 1) fullString += '|{]';
    }
    //console.log(fullString);
    return fullString;
}
function loadWorlds() {
    let string = prompt("Paste Worlds Save Here:")
    if (string === null || string === '') return;

    let worlds = decodeAll(string);
    maps = worlds;

    loadMaps();
    let number = findMapByName(currentMap);
    createMap(maps[number].data);
    ls.save('SCmaps',saveAll())
}
function decodeAll(string) {
    let worlds = string.split('|{]');
    let finalWorlds = [];
    for (let i = 0; i < worlds.length; i++) {
        let nameData = worlds[i].split("}{|");
        let obj = {
            name: nameData[0],
            data: decodeFile(nameData[1]),
        }
        finalWorlds.push(obj)
    }
    return finalWorlds;
}
function loadFile(file) {
    
    createMap(decodeFile(file));
    
    ls.save('SCmaps',saveAll())
    
    loadMaps();
    
}
function deleteSave(name) {
    maps.splice(findMapByName(name), 1);
    if (maps.length < 1) {
        maps.push({
            name: "Untitled 1",
            data: makeMap(mapSize,mapSize)
        });
        currentMap = 'Untitled 1';
    }
    if (currentMap === name) currentMap = maps[0].name;
    
    let number = findMapByName(currentMap);
    createMap(maps[number].data);
    loadMaps();
    ls.save('SCmaps',saveAll())

}
function testPlay() {
    ls.save('scTestPlayer',convertTableToMap());
    ls.save('scCurrentMap',currentMap);
    let testPlayer = window.open("./testPlay.html","_self")
}
function loadTileInspector() {
    $('rsblIMG').src = '../img/' + selectedCell.img + '.png';
    $('rsblMapName').innerHTML = selectedCell.name

    loadAttributes();
}
function loadMapInspector() {
    let map = maps[findMapByName(currentMap)];
    let canvas = $('rsbrCanvas');

    $('rsbrMapName').innerHTML = map.name;
    
    canvas.height = 40;
    canvas.width = 40;
    canvas.style.height = '40px';
    canvas.style.width = '40px';
    drawEverything(canvas,map.data,false,false,false,true,false,false)

    
}

function resizeAll() {
    
    //Fix Map Size
    fixMapSize();
}
///////////////////
// End Functions //
///////////////////
//////////////////////////
//  Interative Actions  //
////////////////////////// 

window.addEventListener('mousedown',function(e) {
    mouseDown = true;
})
window.addEventListener('mouseup',function(e) {
    mouseDown = false;
})
window.addEventListener('keydown',function(e) {
    let key = e.key;
    let lkey = e.key.toLowerCase(); //Key but in lowercase no matter what 

    if (!isNaN(Number(key))) {
        if (!tiles[Number(key)]) return;
        selectedCell = tiles[Number(key)]
        createTileOptions();
    }
    if (lkey == 'q') {
        showGrid = showGrid ? false : true;
    }
    if (lkey == 'shift') {
        shiftDown = true;
    }
    if (lkey == 'control') {
        controlDown = true;
    }
    if (lkey == 'a') rotation = 'left';
    if (lkey == 'd') rotation = 'right';
    if (lkey == 'w') rotation = 'up';
    if (lkey == 's' && !controlDown) rotation = 'down';
    else if (lkey == 's' && controlDown) {
        e.preventDefault();
        saveMap();
    }
    if (lkey == 'l' && controlDown) {
        e.preventDefault();
        loadFile(prompt());
    }
    if (lkey == 'a' || lkey == 's' || lkey == 'd' || lkey == 'w') createOptions();

    if (controlDown && lkey == 'p') {
        e.preventDefault();
        testPlay();
    }
})
window.addEventListener('keyup',function(e) {
    let key = e.key;
    let lkey = e.key.toLowerCase(); //Key but in lowercase no matter what 

    if (lkey == 'shift') {
        shiftDown = false;
    }
    if (lkey == 'control') {
        controlDown = false;
    }
})
window.addEventListener('resize',resizeAll)

///////////////////////////////
//  End Interactive Actions  //
///////////////////////////////

loadImagesFirst();