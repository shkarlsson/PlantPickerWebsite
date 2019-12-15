function drawBranches(canvasId, typeOfPlant, startX, startY, trunkWidth, level) {
	level += 1
    canvas = document.getElementById(canvasId);
    context = canvas.getContext('2d');
    console.log(typeOfPlant)
    if(level < 13) {
    	/*if(level == 1 && typeOfPlant == 'Shrubs') {
    		drawBranches(canvasId, typeOfPlant, startX, startY, trunkWidth * 0.7, level);
			drawBranches(canvasId, typeOfPlant, startX, startY, trunkWidth * 0.7, level);
		}*/
		if(level == 1 && typeOfPlant == 'Shrubs') {
			var maxChangeX = 0
			var maxChangeY = 0
		}
		else if((level < 5 && typeOfPlant == 'Ornamental Grasses') || (level < 7 && typeOfPlant == 'Groundcover')) {
			var maxChangeX = canvas.height / 3 / level;
			var maxChangeY = 0
		}
		else{
			var maxChangeX = canvas.height / 4 / level;
			var maxChangeY = canvas.height / 3 / level;
		}

		var topRightX = startX + Math.random() * maxChangeX;
		var topRightY = startY - Math.random() * maxChangeY;

		var topLeftX = startX - Math.random() * maxChangeX;
		var topLeftY = startY - Math.random() * maxChangeY;

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