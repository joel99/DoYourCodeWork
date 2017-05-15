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

var mode = DEFAULT; //edited with other buttons on editor page
mode = ADD_PT;

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
    
    return c;

}

var addPoint = function(x, y){
//    if (ir.value)
//	editorCanvas.appendChild(makePoint(x, y, ir.value));
  //  else
	editorCanvas.appendChild(makePoint(x,y,"20"));
}

var addElement = function(e){
    switch (mode){
    case ADD_PT:
	addPoint(mousex.toString(), mousey.toString());
	break;	
    }

}

var pointClick = function(e){
    console.log("point clicked");
}

editorCanvas.addEventListener("click", addElement);
//clrBtn.addEventListener("click", clrEditor);


//LOAD DATA!
