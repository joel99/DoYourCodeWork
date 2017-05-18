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

//Information
var mapName = document.getElementById("mapName");
var pgName = document.getElementById("pgName");
var page = 1; //default

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
var makePoint = function(x,y,r){
    
    var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    c.setAttribute("cx", x);
    c.setAttribute("cy", y);
    c.setAttribute("r", r);
    c.setAttribute("fill", "black");
    c.setAttribute("customType", "pt");

    c.addEventListener("click", elClick);
    
    return c;

}

var makePointShadow = function(x,y,r){
    c = makePoint(x,y,r);
    c.setAttribute("fill", "grey");
    c.setAttribute("customType", "ptShadow");
    c.setAttribute("active", true);
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

var makeNode = function(x, y, r){

    return null;
    
}

var makeCnxn = function(){

    return null;

}

var addPoint = function(x, y){
    editorCanvas.appendChild(makePoint(x,y,"20"));
}

var addPath = function(x, y){
    editorCanvas.appendChild(makePath(x, y, mousex.toString(), mousey.toString()));
}


var updateCanvas = function(e){
    //console.log("mouse moved");
    
    for (i = 0; i < editorCanvas.children.length; i++){
	child = editorCanvas.childNodes[i];
	
	if (child.getAttribute("active") == "true"){
	    switch (mode){
	    case CONF_PATH:
		child.setAttribute("x2", mousex.toString());
		child.setAttribute("y2", mousey.toString());
		break;
	    case ADD_PT:
		child.setAttribute("cx", mousex.toString());
		child.setAttribute("cy", mousey.toString());
		break;
	    }

	    
	}
    }
    
}

var distance = function(x1,y1,x2,y2){
    return Math.sqrt( Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2) );
}

var validPtDistance = function(x, y){
    
    for (i = 0; i < editorCanvas.children.length; i++){
	child = editorCanvas.childNodes[i];
	type = child.getAttribute("customType");
	if (type == "pt" || type == "cnxn" || type == "node"){
	    childX = child.getAttribute("cx");
	    childY = child.getAttribute("cy");
	    if (distance(x,y,childX, childY) < 30) {
		return false;
	    }
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
	if (validPtDistance(mousex, mousey)){
	    addPoint(mousex, mousey);
	    logStatus("pointed added!");
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
	    addPath(closest.getAttribute("cx"), closest.getAttribute("cy"));
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
	    editorCanvas.lastChild.setAttribute("active", false);
	}
	break;
//    default:
//	logStatus("Non-functional/default");
//	break;
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
	if (newMode == ADD_PT) editorCanvas.appendChild(makePointShadow(0,0,20));
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


//Needs to be edited to remove dependencies
var clrEditor = function(){
    while (editorCanvas.hasChildNodes()){
	editorCanvas.removeChild(editorCanvas.lastChild);
    }
};





clrBtn.addEventListener("click", clrEditor);
