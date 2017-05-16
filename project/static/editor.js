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

//GENERAL UI
var clrBtn = document.getElementById("clearBtn");
var delPgBtn = document.getElementById("delPgBtn");
var delMapBtn = document.getElementById("delMapBtn");
var pubMapBtn = document.getElementById("pubMapBtn");

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
mode = ADD_PATH;

var delElBtn = document.getElementById("delElBtn");
//TODO: ADD OPTIONS FOR ADD_ UI



//Needs to be edited to remove dependencies
var clrEditor = function(){
    while (editorCanvas.hasChildNodes()){
	editorCanvas.removeChild(editorCanvas.lastChild);
    }
};

var makePoint = function(x,y,r){
    
    var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    c.setAttribute("cx", x);
    
    c.setAttribute("cy", y);
    
    c.setAttribute("r", r);
    
    c.setAttribute("fill", "black");

    c.addEventListener("click", pointClick);

    c.setAttribute("customType", "pt");
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
    l.addEventListener("click", pathClick);
    l.setAttribute("customType", "path");
    l.setAttribute("active", true);

    return l;
}

var addPoint = function(x, y){
    editorCanvas.appendChild(makePoint(x,y,"20"));
}

var addPath = function(x, y){
    editorCanvas.appendChild(makePath(x, y, mousex.toString(), mousey.toString()));
}


var addElement = function(e){
    switch (mode){
    case ADD_PT:
	addPoint(mousex.toString(), mousey.toString());
	break;	
    
    case ADD_PATH:
	addPath(mousex.toString(), mousey.toString());
	mode = CONF_PATH;
	break;

    case CONF_PATH:
	//edits last child
	break;
    }

}

//merge functions
var pointClick = function(e){
    console.log("point clicked");
}

var pathClick = function(e){

    if (mode == CONF_PATH){
	mode = DEFAULT;
	this.setAttribute("active", false);
    }
    console.log("pathClicked");
}


var updateCanvas = function(e){
    //console.log("mouse moved");

    for (i = 0; i < editorCanvas.children.length; i++){
	child = editorCanvas.childNodes[i];
	
	if (child.getAttribute("active")){
	    //console.log("thing is active");
	    if (mode == CONF_PATH){//put in switch case, etc
		child.setAttribute("x2", mousex.toString());
		child.setAttribute("y2", mousey.toString());
	    }
	}
    }
    
}


editorCanvas.addEventListener("click", addElement);
editorCanvas.addEventListener("mousemove", updateCanvas);
//clrBtn.addEventListener("click", clrEditor);

//To do - add restrictions on clicking, status bar (error log)
//Custom colors and path etc
//LOAD DATA!
