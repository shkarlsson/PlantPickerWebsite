function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

function drawBranches(canvasId, typeOfPlant, startX, startY, trunkWidth, level) {
	level += 1
    canvas = document.getElementById(canvasId);
    context = canvas.getContext('2d');
	console.log(typeOfPlant)
	var rr = [0,1]

    if(level < 13) {
		if(level == 1 && typeOfPlant == 'Shrubs') {
			var maxChangeX = 0
			var maxChangeY = 0
		}
		else if((level < 8 && typeOfPlant == 'Ornamental Grasses') || (level < 10 && typeOfPlant == 'Groundcovers')) {
			console.log('og or gc')
			var maxChangeX = canvas.height / 2 / level;
			var maxChangeY = 0
		}
		else if(level == 1 && typeOfPlant == 'Trees') {
			console.log('tree')
			var maxChangeX = 0;
			var maxChangeY = canvas.height / 3 / level;
			rr[0] = 0.8
		}
		else{
			var maxChangeX = canvas.height / 4 / level;
			var maxChangeY = canvas.height / 3 / level;
		}

		var topRightX = startX + randRange(rr[0],rr[1]) * maxChangeX;
		var topRightY = startY - randRange(rr[0],rr[1]) * maxChangeY;

		var topLeftX = startX - randRange(rr[0],rr[1]) * maxChangeX;
		var topLeftY = startY - randRange(rr[0],rr[1]) * maxChangeY;

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