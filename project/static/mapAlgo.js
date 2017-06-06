import editor.js; //not sure

editor.loadPage(); //not sure 2

// so after loading, the user can choose two nodes

var node1;
var node2;

var chooseNode = function () {
    //cnxn stuff?
    //if no other node, change color and select
    //if already clicked, and the node is clicked again, remove the node and the path
    
    //algo?
    //if two nodes are clicked
    
    
};

var numOfNodes = ; //include function for nums of nodes in map

var optPath = function ( paths, numNodes, start ) {

    //tree/array for shortest paths
    var pathTree = new Array(numNodes);

    //beginning node
    pathTree[start] = true;

    
    var pathLengths = new Array(numNodes);
    var prevPaths = new Array(numNodes);

    for (var i = 0; i < numNodes; i++) {
	pathLengths[i] = paths[start][i];
	//check if a path branching from the start node exists
	if (paths[start][i] != Infinity) { 
	    //store the node as part of the path
	    prevPaths[i] = startVertex; 
	}
    }

    // distance from start node is 0 (duh)
    pathLengths[start] = 0;

    //find shortest path
    for (var i = 0; i < numVertices - 1; i++) {

	// minimum values to create paths
	var min = Infinity;
	var minIndex = -1;
	
	
	for (var j = 0; j < numOfNodes; j++) {
	    // if a shortest path exists
	    if (!pathTree[j] && pathLengths[j] <= min){
		min = pathLengths[j];
		minIndex = j;
	    }
	}
	
	// one shortest path exists
	pathTree[minIndex] = true;
	
	for (var j = 0; j < numNodes; j++) {
	    if (!pathTrees[j]) {
		// check other paths that may be closer
		var altDist = pathLengths[minIndex] + paths[minIndex];
		if (altDist < pathLengths[j]) {
		    pathLengths[j] = altDist;
		    prevPaths[j] = minIndex;
		}
	    }
	}
	
    }


    
    
    
    return { "start": start,
	     "pathLengths": pathLengths,
	     "prevPaths": prevPaths };
    
};

var constructPath = function (shortestPath, endNode) {
    var path = [];
    while (endNode != shortestPath.start) {
	path.unshift(endNode);
	endNode = shortestPath.prevPaths[endNode];
    }
    return path;
};

//var map = makeEdges(..)

var path1to3 = constructPath(optPath(map, numNodes, 1), 6);



var makeEdges = function (nodes) {
    // make sure nodes have id
    // make sure paths have some sort of id
    // see if there exists a path between each node - no path = infinity, yes path = dist formula
};






