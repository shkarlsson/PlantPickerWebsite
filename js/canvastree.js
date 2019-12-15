function drawBranches(canvasId, typeOfPlant, startX, startY, trunkWidth, level) {
	level += 1
    canvas = document.getElementById(canvasId);
	context = canvas.getContext('2d');
	console.log(typeOfPlant)
    //console.log(typeOfPlant)
    if(level < 10) {
    	if((level < 3 && typeOfPlant == 'Shrubs')||typeOfPlant=='Ornamental Grasses') {
			console.log('adding low branch for level '+ level)
    		drawBranches(canvasId, typeOfPlant, startX, startY, trunkWidth * 0.7, level);
			drawBranches(canvasId, typeOfPlant, startX, startY, trunkWidth * 0.7, level);
    	}
    	else {
			var changeX = (canvas.height / 4) / (level);
			var changeY = (canvas.height / 3) / (level);

			var topRightX = startX + Math.random() * changeX;
			var topRightY = startY - Math.random() * changeY;

			var topLeftX = startX - Math.random() * changeX;
			var topLeftY = startY - Math.random() * changeY;

			// draw right branch
			context.beginPath();
			context.moveTo(startX + trunkWidth / 4, startY);
			context.quadraticCurveTo(startX + trunkWidth / 4, startY - trunkWidth, topRightX, topRightY);
			context.lineWidth = trunkWidth;
			context.lineCap = 'round';
			context.stroke();

			// draw left branch
			context.beginPath();
			context.moveTo(startX - trunkWidth / 4, startY);
			context.quadraticCurveTo(startX - trunkWidth / 4, startY - trunkWidth, topLeftX, topLeftY);
			context.lineWidth = trunkWidth;
			context.lineCap = 'round';
			context.stroke();

			drawBranches(canvasId, typeOfPlant, topRightX, topRightY, trunkWidth * 0.7, level);
			drawBranches(canvasId, typeOfPlant, topLeftX, topLeftY, trunkWidth * 0.7, level);
			}
    }
}

var treesInCanvases = {}
function drawTree(treeId, typeOfPlant) {
	$(document).ready(function(){
		treesInCanvases[treeId] = {}
		treesInCanvases[treeId].canvasId = "canvasFor" + treeId
		treesInCanvases[treeId].canvasId = treesInCanvases[treeId].canvasId.toLowerCase()
		//console.log("Ritar träd nu i #" + treesInCanvases[treeId].canvasId)
		treesInCanvases[treeId].canvas = document.getElementById(treesInCanvases[treeId].canvasId);
		context = treesInCanvases[treeId].canvas.getContext('2d');
		context.fillStyle = '#fafafa'
		context.fillRect(0,0,treesInCanvases[treeId].canvas.width,treesInCanvases[treeId].canvas.height)
		context.fill()
		drawBranches(treesInCanvases[treeId].canvasId, typeOfPlant, treesInCanvases[treeId].canvas.width / 2, treesInCanvases[treeId].canvas.height, treesInCanvases[treeId].canvas.height / 30, 0);
	})
}