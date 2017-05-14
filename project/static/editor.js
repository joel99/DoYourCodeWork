var editorCanvas = document.getElementById("editorCanvas");
var width = editorCanvas.getAttribute("width");
var height = edtorCanvas.getAttribute("height");

var clrBtn = document.getElementById("clearbtn");
var mousex, mousey;

//TODO define constants
var mode = 1; //edited with other buttons on editor page

svgImage.addEventListener("mousemove", function(e) {
    mousex = e.offsetX;
    mousey = e.offsetY;
});

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
    if (ir.value)
	editorCanvas.appendChild(makePoint(x, y, ir.value));
    else
	editorCanvas.appendChild(makePoint(x,y,"20"));
}

var addElement = function(e){
    switch (mode){
    case 1:
	addPoint(mousex.toString(), mousey.toString());
	break;	
    }

}

var pointClick = function(e){
    console.log("point clicked");
}

editorCanvas.addEventListener("click", addElement);
clrBtn.addEventListener("click", clrEditor);
