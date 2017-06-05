//Rough organization
//updateCanvas, canvasClick, and elClick are most important funcitons. everything else just helps

//ROAD MAP for JOEL:
//add panning/moving via public library
//submission fields for editable attributes
//add file upload/download for background images
//pretty submission areas

//Notes:
//you can edit map name in main dashboard AND map edit page (for user friendliness)

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

//Page stuff
var mapTitle = document.getElementById("mapTitle");
var pgTitle = document.getElementById("pgTitle");
var monitor = document.getElementById("monitor");

//Information
//var mapName = document.getElementById("mapName");
//var pgName = document.getElementById("pgName");

var totalPages = 0; //load
var idCount = 0; //simple id scheme, just count up every time element is made

var getActivePage = function(){
    for (i = 0; i < editorCanvas.children.length; i++){
	var child = editorCanvas.childNodes[i];
	if ( child.getAttribute("isCurrent") == "true" ){
	    return child;
	}
    }
    return null;
}


var getPage = function(num){
    for (i = 0; i < editorCanvas.children.length; i++){
	var child = editorCanvas.childNodes[i];
	if ( child.getAttribute("num") == num ){
	    return child;
	}
    }
    return null;    
}

var setPage = function(num){

    clrActive();
    clrMonitor();
    
    var page = getActivePage();
    var i;
    var child;
    for (i = 0; i < page.children.length; i++){
	var child = page.childNodes[i];
	child.setAttribute("visibility", "hidden");
    }

    page.setAttribute("isCurrent", "false");
    getPage(num).setAttribute("isCurrent", "true");
    page.setAttribute("id", "viewport");
    
    clrActive();
    page = getActivePage();
    pgTitle.innerHTML =  page.getAttribute("num") + " / " + page.getAttribute("name");

    for (i = 0; i < page.children.length; i++){
	var child = page.childNodes[i];
	child.setAttribute("visibility", "visible");
    }
    
}

var toNextPage = function(){
    var page = getActivePage();
    if (parseInt(page.getAttribute("num")) != totalPages){
	setPage(parseInt(page.getAttribute("num")) + 1);
    }
    else{
	logStatus("You're on the last page");
    }
}

var toPrevPage = function(){
    var page = getActivePage();
    if (parseInt(page.getAttribute("num")) != 1){
	setPage(parseInt(page.getAttribute("num")) - 1);
    }
    else {
	logStatus("You're on the first page");
    }
}

var addPage = function(){

    var p = document.createElementNS("http://www.w3.org/2000/svg", "g");
    p.setAttribute("name", "example");
    p.setAttribute("num", totalPages + 1);

    if (totalPages == 0){
	p.setAttribute("isCurrent", "true");
	totalPages += 1;
	editorCanvas.appendChild(p);		
	p.setAttribute("id", "viewport");
    }
    else if (getActivePage().getAttribute("num") == totalPages){//there is already a page, and this is the last page
	editorCanvas.appendChild(p);
	totalPages += 1;	
	toNextPage();
	p.setAttribute("id", "viewport");
    }
    
    return p;

}

var delPage = function(){

    //TODO : ADD PROMPT!
    if (totalPages == 0) logStatus("can't remove page");
    else {
	logStatus("page removed");
	var curPage = getActivePage();
	if (totalPages == 1){
	    //disable thing...
	    pgTitle.innerHTML = "NO PAGES LEFT.";
	}
	else{
	    if (curPage.getAttribute("num") == 1){
		//doubly inefficient! for sake of saving code!
		setPage(2);
		getPage(2).setAttribute("num", 1);
		
	    }
	    else{
		toPrevPage();//inefficient, just remove...
		for (i = parseInt(curPage.getAttribute("num")); i < editorCanvas.children.length; i++){
		    var child = editorCanvas.childNodes[i];
		    child.setAttribute("num", i);
		}
	    } //reorder pages	    
	}
	
	for (i = 0; i < curPage.children.length; i++){
	    var child = curPage.childNodes[i];
	    if (child.getAttribute("customType") == "cnxn")
		clrCnxn(child);
	}

	editorCanvas.removeChild(curPage);
	totalPages -= 1;
    }
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

//TODO: ADD OPTIONS FOR ADD_ UI

var setMode = function(m){
    mode = m;
}

//PLEASE NOTE: for proximity concerns, each shape that requires space needs "cx", "cy" attributes

var makePt = function(x,y,r){
    
    var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    c.setAttribute("cx", x);
    c.setAttribute("cy", y);
    c.setAttribute("r", r);
    c.setAttribute("fill", "black");
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
    l.setAttribute("customType", "path");
    l.setAttribute("active", true);
    
    return l;
}

var nodePts = function(x, y, r){//triangle
    r = parseInt(r);
    var t = x + "," + (y-r);
    var bL = Math.floor(x - r * .866) + "," + Math.floor(y + r * .5);
    var bR = Math.floor(x + r * .866) + "," + Math.floor(y + r * .5); 
    return  t + " " + bL + " " + bR;
}

var makeNode = function(x, y, r){
    
    var t = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    t.setAttribute("cx", x);
    t.setAttribute("cy", y);
    t.setAttribute("r", r);
    t.setAttribute("points", nodePts(x, y, r));
    t.setAttribute("customType", "node");

    return t;
    
}

var cnxnPts = function(x, y, r){//square
    r = parseInt(r);
    var tL = (x - r) + "," + (y - r);
    var tR = (x + r) + "," + (y - r);
    var bL = (x - r) + "," + (y + r);
    var bR = (x + r) + "," + (y + r);
    return tL + " " + tR + " " + bR + " " + bL;
}

var makeCnxn = function(x, y, r){//forbid "unlinked" name
    
    var s = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    s.setAttribute("cx", x);
    s.setAttribute("cy", y);
    s.setAttribute("r", r);
    s.setAttribute("points", cnxnPts(x, y, r));
    s.setAttribute("customType", "cnxn");
    s.setAttribute("link", "unlinked");
    
    return s;

}

var makeShadow = function(x, y, r, mode){
    var s = null;
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
    var child;
    switch(type){
    case ADD_PT:
	child = makePt( x, y, 20 );
	child.addEventListener("click", elClick);
	break;
    case ADD_PATH:
	child = makePath( x, y, mousex, mousey );
	break;
    case ADD_NODE:
	child = makeNode( x, y, 20 );
	child.addEventListener("click", elClick);
	break;
    case ADD_CNXN:
	child = makeCnxn( x, y, 20 );
	child.addEventListener("click", elClick);
	break;
    }

    if (type >= ADD_PT && type <= ADD_CNXN){
	child.setAttribute("id", idCount);
	child.setAttribute("name", child.getAttribute("customType") + idCount++);
	
    }
    getActivePage().appendChild(child);
    return child;
}

var updateCanvas = function(e){
    
    var page = getActivePage();
    if (page == null){
	
    }
    else{
	for (i = 0; i < page.children.length; i++){
	    var child = page.childNodes[i];
	    
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
}

var distance = function(x1,y1,x2,y2){
    x1 = parseInt(x1);
    y1 = parseInt(y1);
    x2 = parseInt(x2);
    y2 = parseInt(y2);
    return Math.sqrt( Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2) );
}

var validPtDistance = function(x, y){
    var page = getActivePage();
    for (i = 0; i < page.children.length; i++){
	var child = page.childNodes[i];
	var type = child.getAttribute("customType");
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
    var page = getActivePage();
    
    for (i = 0; i < page.children.length; i++){
	var child = page.childNodes[i];
	var type = child.getAttribute("customType");
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

var clickedEl = null; //tracking
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
	    var newPath = addEl(closest.getAttribute("cx"), closest.getAttribute("cy"), ADD_PATH);
	    newPath.setAttribute("p1", closest.getAttribute("id"));
	    mode = CONF_PATH;
	}

	break;

    case CONF_PATH:
	//edits last child
	var closest = closestPathDrop(mousex, mousey); 
	if (closest == null){
	    logStatus("No anchor node");
	}
	else {		   
	    mode = ADD_PATH;
	    var line = getActivePage().lastChild;
	    line.setAttribute("active", false);
	    line.setAttribute("x2", closest.getAttribute("cx"));
	    line.setAttribute("y2", closest.getAttribute("cy"));
	    if (distance(line.getAttribute("x1"), line.getAttribute("y1"),
			 line.getAttribute("x2"), line.getAttribute("y2")) < 5){
		getActivePage().removeChild(line);//prevent self-attachment
	    }
	    line.setAttribute("p2", closest.getAttribute("id"));
	    line.addEventListener("click", elClick);
	}
	break;
    default:
	logStatus("Non-functional/default");
	break;
    }
    console.log("canvas clicked");
    clickedEl = null;
}

var elClick = function(e){
    if (mode == DEFAULT){
	clrMonitor();
	event.stopPropagation();
	updateMonitor(this.getAttribute("customType"), this.getAttribute("name"));
	addMonitorField("Name");
	updateMonitor("Id", this.getAttribute("id"));

	switch (this.getAttribute("customType")){
	case "pt":
	case "node":
	    clickedEl = this;
	    break;
	case "path":
	    updateMonitor("Point One", this.getAttribute("p1"));
	    updateMonitor("Point Two", this.getAttribute("p2"));
	    clickedEl = this;
	    break;
	case "cnxn":
	    updateMonitor("Link", this.getAttribute("link"));
	    addMonitorField("Link");
	    clickedEl = this;
	    break;
	}	
	console.log(this.getAttribute("customType") + " clicked.");
    }
}

var delEl = function(){
    if (clickedEl != null){
	//remove associations
	var page = getActivePage();
	switch (clickedEl.getAttribute("customType")){
	    case "node":
	    case "pt":
	    case "cnxn":
	    for (i = 0; i < page.children.length; i++){
		var child = page.childNodes[i];
		if (child.getAttribute("customType") == "path"){
		    if (child.getAttribute("p1") == clickedEl.getAttribute("id") ||
		        child.getAttribute("p2") == clickedEl.getAttribute("id") )
			page.removeChild(child);
		    }
	    }
	    break;
	}

	if (clickedEl.getAttribute("customType") == "cnxn")
	    clrCnxn(clickedEl);

	page.removeChild(clickedEl);
	for (i = 0; i < page.children.length; i++){
	    var child = page.childNodes[i];
	    var type = child.getAttribute("customType");
	    if (type == "pt" || type == "cnxn" || type == "node"){
		childX = child.getAttribute("cx");
		childY = child.getAttribute("cy");
		if (distance(x,y,childX, childY) < champDist) {
		    ret = child;
		    champDist = distance(x,y,childX, childY);
		}
	    }
	}
	clickedEl = null;
	clrMonitor();
    }
}

var clrCnxn = function(cnxn){
    tarID = cnxn.getAttribute("link");
    for (i = 0; i < editorCanvas.children.length; i++){
	var page = editorCanvas.childNodes[i];
	for (j = 0; j < page.children.length; j++){
	    var child = page.childNodes[j];
	    if (child.getAttribute("id") == tarID){
		child.setAttribute("link", "unlinked");
	    }
	}
    }
}

//To do - add restrictions on clicking, status bar (error log)
//Custom colors and path etc
//LOAD DATA!

//MORE UI FUNCTIONS
var setModeFunc = function(newMode){
    return function(){
	clrActive();
	clrMonitor();
	if (newMode == ADD_PT ||
	    newMode == ADD_CNXN ||
	    newMode == ADD_NODE){
	    var page = getActivePage();
	    page.appendChild(makeShadow(0, 0, 20, newMode));
	}
	setMode(newMode);
    };
}

var clrActive = function(){
    var page = getActivePage();
    if (page != null){
    for (i = 0; i < page.children.length; i++){
	var child = page.childNodes[i];
	if ( child.getAttribute("active") == "true" ){
	    page.removeChild(child);
	    break;
	}
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

//Monitors
//==================================================================


//Needs to be edited to remove dependencies
var clrEditor = function(){
    var page = getActivePage()
    while (page.hasChildNodes()){
	page.removeChild(page.lastChild);
    }
};

var clrMonitor = function(){
    monitor.innerHTML = "";
}

var updateMonitor = function(s1, s2){
    var s = document.createElement("p");
    s.innerHTML = s1 + " : " + s2;
    monitor.appendChild(s);
}

var addMonitorField = function(fieldName){//to be changed
    var f = document.createElement("p");
    f.innerHTML = fieldName;
    monitor.appendChild(f);
}

var pullAJAXData = function(){
    return null;
}

//LOADING PAGE : needs refactoring
var loadMap = function(){//initalization script
    var mapData = pullAJAXData();
    //loadTitle(mapData["title"]); //UNCOMMENT
    if (//mapData["canvasData"] != null // UNCOMMENT
       mapData != null){
        var canvasJSON = mapData["canvasData"]; //and then process it
	//totalPages = canvasJSON["pages"];
	totalPages = 0;
	idCount = canvasJSON["idCt"];
	
	for (pageData in canvasJSON["canvas"]){
	    var page = addPage();
	    page.setAttribute( "name", pageData["name"] );
	    //page.setAtribute( "num", pageData["num"] ); //not sure we need this
	    page.setAttribute( "isCurrent", false );
	    page.setAttribute( "id", "viewport" );
	    for (item in pageData["data"]){
		var el;
		switch (item["type"]){
		    //name, id
		case "pt":
		    el = makePt(item["cx"], item["cy"], item["r"]);
		    break;
		case "node":
		    el = makeNode(item["cx"], item["cy"], item["r"]);
		    break;
		case "cnxn":
		    el = makeCnxn(item["cx"], item["cy"], item["r"]);
		    el.setAttribute("link", item["link"]);
		    break;
		case "path":
		    el = makePath(item["x1"], item["y1"], item["x2"], item["y2"]);
		    el.setAttribute("p1", item["p1"]);
		    el.setAttribute("p2", item["p2"]);
		    el.setAttribute("stroke-width", item["width"]);
		    break;
		}
		
		el.setAttribute("name", item["name"]);
		el.setAttribute("id", item["id"]);
		el.setAttribute("visibility", "hidden");
		page.appendChild(el);
	    }
	}
	if (totalPages != 0){
            setPage(1);
	}

    }
    else{ //default loading
	totalPages = 0; //load
	idCount = 0; //simple id scheme, just count up every time element is made
	addPage();
	page = getActivePage();    
	pgTitle.innerHTML =  page.getAttribute("num") + " / " + page.getAttribute("name");
	mode = DEFAULT;
    }

}

loadMap();

var loadTitle = function(title){
    mapTitle.innerHTML = title;
}

//Buttons/Event Listeners
var ptBtn = document.getElementById("ptBtn");
var nodeBtn = document.getElementById("nodeBtn");
var pathBtn = document.getElementById("pathBtn");
var cnxnBtn = document.getElementById("cnxnBtn");
var delElBtn = document.getElementById("delElBtn");

var clrBtn = document.getElementById("clrBtn");
var delPgBtn = document.getElementById("delPgBtn");
var delMapBtn = document.getElementById("delMapBtn");
var pubMapBtn = document.getElementById("pubMapBtn");
var saveMapBtn = document.getElementById("saveMapBtn");
var addPgBtn = document.getElementById("addPgBtn"); //file upload

//note: might be replaced with better navigation system
var nextPgBtn = document.getElementById("nextPgBtn");
var lastPgBtn = document.getElementById("lastPgBtn");

var saveMapBtn = document.getElementById("saveMapBtn");
var pubMapBtn = document.getElementById("pubMapBtn");

editorCanvas.addEventListener("click", canvasClick);
editorCanvas.addEventListener("mousemove", updateCanvas);
editorCanvas.addEventListener('contextmenu', rClick, false);

ptBtn.addEventListener("click", setModeFunc(ADD_PT));
pathBtn.addEventListener("click", setModeFunc(ADD_PATH));
nodeBtn.addEventListener("click", setModeFunc(ADD_NODE));
cnxnBtn.addEventListener("click", setModeFunc(ADD_CNXN));

clrBtn.addEventListener("click", clrEditor);
addPgBtn.addEventListener("click", addPage);
delPgBtn.addEventListener("click", delPage);
nextPgBtn.addEventListener("click", toNextPage);
prevPgBtn.addEventListener("click", toPrevPage);
delElBtn.addEventListener("click", delEl);
saveMapBtn.addEventListener("click", saveMap);

//SAVING AND LOADING
var saveMap = function(){
    var mapJSON = canvasToJSON();
    $.ajax({
	    type: "POST",
	    url : "/saveData/",
	    dataType: "json",
	    data: JSON.stringify(mapJSON),
	    success: function(response) {
		console.log("works");
	    error: function(response) {
		console.log("nope");
	    }
	});
    return null;
}

var canvasToJSON = function(){

    //not sure if we need pages
    var canvasJSON = {"canvas": [], "pages" : totalPages, "idCt" : idCount };
    for (i = 0; i < editorCanvas.children.length; i++){
	var child = editorCanvas.childNodes[i]; //store pages
	var pageDict = {"name": child.getAttribute("name"), 
			    "num": child.getAttribute("num"), 
			    "data" : []}; 
	canvasJSON["canvas"].push(pageDict);
	for (j = 0; j < child.children.length; j++){
	    var item = child.childNodes[j];
	    var itemDict = {"name": item.getAttribute("name"),
			    "id": item.getAttribute("id"),
			    "type": item.getAttribute("customType"),
			   }//add color here
	    switch (item.getAttribute("customType")){
		case "pt":
		case "node":
		itemDict["cx"] = item.getAttribute("cx");
		itemDict["cy"] = item.getAttribute("cy");
		itemDict["r"] = item.getAttribute("r");
		break;
		case "cnxn":
		itemDict["cx"] = item.getAttribute("cx");
		itemDict["cy"] = item.getAttribute("cy");
		itemDict["r"] = item.getAttribute("r");
		itemDict["link"] = item.getAttribute("link");
		break;
		case "path":
		itemDict["x1"] = item.getAttribute("x1");
		itemDict["y1"] = item.getAttribute("y1");
		itemDict["x2"] = item.getAttribute("x2");
		itemDict["y2"] = item.getAttribute("y2");
		itemDict["p1"] = item.getAttribute("p1");
		itemDict["p2"] = item.getAttribute("p2");
		itemDict["width"] = item.getAttribute("stroke-width");
		break;
	    }
	    pageDict["data"].push(itemDict);
	}
    }
    console.log(canvasJSON);
    $.ajax({
	    type: "POST",
	    url : "/saveData/",
	    dataType: "json",
	    data: {
		"canvasDict" : canvasJSON
	    },
	    success: function(response) {
		console.log("works");
	    error: function(response) {
		console.log("nope");
	    }
	});
    return canvasJSON;
}

var refreshIDs = function(){
    //to prevent overflow (long term sustainability)
}
