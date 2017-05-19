//Rough organization
//updateCanvas, canvasClick, and elClick are most important funcitons. everything else just helps

var editorCanvas = document.getElementById("editorCanvas");
var width = editorCanvas.getAttribute("width");
var height = editorCanvas.getAttribute("height");

var mousex, mousey;

editorCanvas.addEventListener("mousemove", function(e) {
    mousex = e.offsetX;
    mousey = e.offsetY;
});

var logStatus = function(s){
    document.getElementById("status").innerHTML = s;
}

//GENERAL UI
var clrBtn = document.getElementById("clrBtn");
var delPgBtn = document.getElementById("delPgBtn");
var delMapBtn = document.getElementById("delMapBtn");
var pubMapBtn = document.getElementById("pubMapBtn");
var saveMapBtn = document.getElementById("saveMapBtn");
var addPgBtn = document.getElementById("addPgBtn"); //file upload

//note: might be replaced with better navigation system
var nextPgBtn = document.getElementById("nextPgBtn");
var lastPgBtn = document.getElementById("lastPgBtn");

//Page stuff

//Information
//var mapName = document.getElementById("mapName");
//var pgName = document.getElementById("pgName");
var page = 0; //default
var maxPages = 0; //load

var addPage = function(){
    var p = document.createElementNS("http://www.w3.org/2000/svg", "g");
    p.setAttribute("name", "example");
    p.setAttribute("num", maxPages + 1);
    p.setAttribute("isCurrent", "true");
}

var rmPage = function(){
    //deletes current page
    //TODO : ADD PROMPT!
    
    editorCanvas.removeChild();
}



//EDITOR UI
const DEFAULT = 1;
const ADD_PT = 2;
const ADD_NODE = 3;
const ADD_PATH = 4;
const ADD_CNXN = 5;
const EDIT = 6;
const CONF_PATH = 7;

var mode = DEFAULT; //edited with other buttons on editor page

var delElBtn = document.getElementById("delElBtn");
//TODO: ADD OPTIONS FOR ADD_ UI

var setMode = function(m){
    mode = m;
}

var ptBtn = document.getElementById("ptBtn");
var nodeBtn = document.getElementById("nodeBtn");
var pathBtn = document.getElementById("pathBtn");
var cnxnBtn = document.getElementById("cnxnBtn");

//PLEASE NOTE: for proximity concerns, each shape that requires space needs "cx", "cy" attributes
var makePt = function(x,y,r){
    
    var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    c.setAttribute("cx", x);
    c.setAttribute("cy", y);
    c.setAttribute("r", r);
    c.setAttribute("fill", "black");
    c.setAttribute("customType", "pt");

    c.addEventListener("click", elClick);
    
    return c;

}

var makePath = function(x1, y1, x2, y2){

    var l = document.createElementNS("http://www.w3.org/2000/svg", "line");

    l.setAttribute("x1", x1);
    l.setAttribute("y1", y1);
    l.setAttribute("x2", x2);
    l.setAttribute("y2", x2);
    l.setAttribute("stroke", "black");
    l.setAttribute("stroke-width", "4");
    l.setAttribute("customType", "path");
    l.setAttribute("active", true);

    l.addEventListener("click", elClick);
    
    return l;
}

var nodePts = function(x, y, r){//triangle
    r = parseInt(r);
    t = x + "," + (y-r);
    bL = Math.floor(x - r * .866) + "," + Math.floor(y + r * .5);
    bR = Math.floor(x + r * .866) + "," + Math.floor(y + r * .5); 
    return  t + " " + bL + " " + bR;
}

var makeNode = function(x, y, r){
    
    var t = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    t.setAttribute("cx", x);
    t.setAttribute("cy", y);
    t.setAttribute("r", r);
    t.setAttribute("points", nodePts(x, y, r));
    t.setAttribute("customType", "node");
    t.addEventListener("click", elClick);

    return t;
    
}

var cnxnPts = function(x, y, r){//square
    r = parseInt(r);
    tL = (x - r) + "," + (y - r);
    tR = (x + r) + "," + (y - r);
    bL = (x - r) + "," + (y + r);
    bR = (x + r) + "," + (y + r);
    return tL + " " + tR + " " + bR + " " + bL;
}

var makeCnxn = function(x, y, r){
    
    var s = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    s.setAttribute("cx", x);
    s.setAttribute("cy", y);
    s.setAttribute("r", r);
    s.setAttribute("points", cnxnPts(x, y, r));
    s.setAttribute("customType", "cnxn");
    s.addEventListener("click", elClick);

    return s;

}

var makeShadow = function(x, y, r, mode){
    s = null;
    switch(mode){
    case ADD_PT:
	s = makePt(x, y, r);
	break;
    case ADD_NODE:
	s = makeNode(x, y, r);
	break;
    case ADD_CNXN:
	s = makeCnxn(x, y, r);
	break;
    }

    s.setAttribute("fill", "grey");
    s.setAttribute("customType", s.getAttribute("customType") + "Shadow");
    s.setAttribute("active", true);
    s.setAttribute("visibility", "hidden");   

    return s;

}




var addEl = function(x, y, type){
    switch(type){
    case ADD_PT:
	child = makePt( x, y, 20 );
	break;
    case ADD_PATH:
	child = makePath( x, y, mousex, mousey );
	break;
    case ADD_NODE:
	child = makeNode( x, y, 20 );
	break;
    case ADD_CNXN:
	child = makeCnxn( x, y, 20 );
	break;
    }
    editorCanvas.appendChild(child);
}

var updateCanvas = function(e){
    //console.log("mouse moved");
    
    for (i = 0; i < editorCanvas.children.length; i++){
	child = editorCanvas.childNodes[i];
	
	if (child.getAttribute("active") == "true"){
	    switch (mode){
	    case CONF_PATH:
		//if (child.getAttribute("x2") != mousex.toString()){
		//    console.log("Unfair!");
		//}
		child.setAttribute("x2", mousex);
		child.setAttribute("y2", mousey);
		break;
	    case ADD_PT:		
		child.setAttribute("visibility", "visible");
		child.setAttribute("cx", mousex);
		child.setAttribute("cy", mousey);
		break;
	    case ADD_CNXN:
		child.setAttribute("visibility", "visible");
		child.setAttribute("cx", mousex);
		child.setAttribute("cy", mousey);
		child.setAttribute("points", cnxnPts(mousex, mousey, child.getAttribute("r")));	
		break;
	    case ADD_NODE:		
		child.setAttribute("visibility", "visible");
		child.setAttribute("cx", mousex);
		child.setAttribute("cy", mousey);
		child.setAttribute("points", nodePts(mousex, mousey, child.getAttribute("r")));
		break;
	    }	    

	    
	}
    }
    
}

var distance = function(x1,y1,x2,y2){
    x1 = parseInt(x1);
    y1 = parseInt(y1);
    x2 = parseInt(x2);
    y2 = parseInt(y2);
    return Math.sqrt( Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2) );
}

var validPtDistance = function(x, y){
    
    for (i = 0; i < editorCanvas.children.length; i++){
	child = editorCanvas.childNodes[i];
	type = child.getAttribute("customType");
	if (type == "pt" || type == "cnxn" || type == "node"){
	    childX = child.getAttribute("cx");
	    childY = child.getAttribute("cy");
	    if (distance(x,y,childX, childY) < 30)
		return false;
	}
    }
    
    return true;

}

var closestPathDrop = function(x,y){

    var ret = null;
    var champDist = 10000;
    const minThresh = 30;

    for (i = 0; i < editorCanvas.children.length; i++){
	child = editorCanvas.childNodes[i];
	type = child.getAttribute("customType");
	if (type == "pt" || type == "cnxn" || type == "node"){
	    childX = child.getAttribute("cx");
	    childY = child.getAttribute("cy");
	    if (distance(x,y,childX, childY) < champDist) {
		ret = child;
		champDist = distance(x,y,childX, childY);
	    }
	}
    }
    
    if (champDist < minThresh) return ret;
    else return null;

}

//concerns: runtime
var canvasClick = function(e){

    switch (mode){
    case ADD_PT:
    case ADD_NODE:
    case ADD_CNXN:
	if (validPtDistance(mousex, mousey)){
	    addEl(mousex, mousey, mode);
	    logStatus("something added!");
	}
	else{
	    logStatus("too close");
	}
	break;	

    case ADD_PATH:
	closest = closestPathDrop(mousex, mousey); 
	if (closest == null){
	    logStatus("No anchor node");
	}
	else {	
	    addEl(closest.getAttribute("cx"), closest.getAttribute("cy"), ADD_PATH);
	    mode = CONF_PATH;
	}

	break;

    case CONF_PATH:
	//edits last child
	closest = closestPathDrop(mousex, mousey); 
	if (closest == null){
	    logStatus("No anchor node");
	}
	else {		   
	    mode = ADD_PATH;
	    line = editorCanvas.lastChild;
	    line.setAttribute("active", false);
	    line.setAttribute("x2", closest.getAttribute("cx"));
	    line.setAttribute("y2", closest.getAttribute("cy"));
	    if (distance(line.getAttribute("x1"), line.getAttribute("y1"),
			 line.getAttribute("x2"), line.getAttribute("y2")) < 5){
		editorCanvas.removeChild(line);//prevent self-attachment
	    }
	}
	break;
    default:
	logStatus("Non-functional/default");
	break;
    }

}

var elClick = function(e){
    switch (this.getAttribute("customType")){
    case "pt":
	break;
    case "path":
	break;
    case "node":
	break;
    case "cnxn":
	break;
    }
    console.log(this.getAttribute("customType") + " clicked.");
}


editorCanvas.addEventListener("click", canvasClick);
editorCanvas.addEventListener("mousemove", updateCanvas);

//To do - add restrictions on clicking, status bar (error log)
//Custom colors and path etc
//LOAD DATA!

//MORE UI FUNCTIONS
var setModeFunc = function(newMode){
    return function(){
	clrActive();
	if (newMode == ADD_PT ||
	    newMode == ADD_CNXN ||
	    newMode == ADD_NODE)
	    editorCanvas.appendChild(makeShadow(0, 0, 20, newMode));

	setMode(newMode);
    };
}

ptBtn.addEventListener("click", setModeFunc(ADD_PT));
pathBtn.addEventListener("click", setModeFunc(ADD_PATH));
nodeBtn.addEventListener("click", setModeFunc(ADD_NODE));
cnxnBtn.addEventListener("click", setModeFunc(ADD_CNXN));

var clrActive = function(){
    for (i = 0; i < editorCanvas.children.length; i++){
	child = editorCanvas.childNodes[i];
	console.log(child);
	if ( child.getAttribute("active") == "true" ){
	    editorCanvas.removeChild(child);
	    break;
	}
    }
}

var rClick = function(e){
    e.preventDefault();
    setMode(DEFAULT);
    logStatus("Canceled!");
    //clear active shapes
    //there's probably an easier way of doing this - check later
//    console.log(editorCanvas.children);
    clrActive();
}

editorCanvas.addEventListener('contextmenu', rClick, false);

//OTHER THINGS
//==================================================================


//Needs to be edited to remove dependencies
var clrEditor = function(){
    while (editorCanvas.hasChildNodes()){
	editorCanvas.removeChild(editorCanvas.lastChild);
    }
};


clrBtn.addEventListener("click", clrEditor);
