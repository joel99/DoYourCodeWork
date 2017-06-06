//Buttons/Event Listeners
var clrBtn = document.getElementById("clrBtn");
var srcNodeBtn = document.getElementById("srcNodeBtn");
var destNodeBtn = document.getElementById("destNodeBtn");
var calcBtn = document.getElementById("calcBtn");

clrBtn.addEventListener("click", initialize);
srcNodeBtn.addEventListener("click", setModeFunc(src));
destNodeBtn.addEventListener("click", setModeFunc(ADD_NODE));
calcBtn.addEventListener("click", setModeFunc(ADD_CNXN));
