//Buttons/Event Listeners
var clrBtn = document.getElementById("clrBtn");
var srcNodeBtn = document.getElementById("srcNodeBtn");
var destNodeBtn = document.getElementById("destNodeBtn");
var calcBtn = document.getElementById("calcBtn");
var editorCanvas = document.getElementById("editorCanvas");


clrBtn.addEventListener("click", initialize);
srcNodeBtn.addEventListener("click", setModeFunc(DEF_SRC));

//defined constants
destNodeBtn.addEventListener("click", setModeFunc(DEF_DEST));
calcBtn.addEventListener("click", function(){
        makePath(node1, node2);
});


editorCanvas.addEventListener('contextmenu', setModeFunc(DEFAULT), false);
