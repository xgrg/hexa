// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html
base_image = new Image();
base_image.src = 'hexa.png';

function Hexagon(row, column, color){
    this.row = row;
    this.column = column;
    this.color = color;
    this.isActive = false;
    this.opacity = 1.0;
}

function HexagonGrid(canvasId, radius) {
    this.radius = radius;

    this.height = Math.sqrt(3) * radius;
    this.width = 2 * radius;
    this.side = (3 / 2) * radius;

    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.canvasOriginX = 0;
    this.canvasOriginY = 0;
	
    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);
    this.canvas.addEventListener('mousemove', this.mouseOverEvent.bind(this), false);
    this.hexList = [];
    this.urls = [];
    this.images = [];

    var items = $("div.well");
    for (var i=0; i<items.length ; i++){
        if ($(items[i]).children('p').length != 0){
          var url = $(items[i]).children('p').first().attr('id');
	  this.urls.push(url);

          this.images.push(new Image());
          this.images[this.images.length - 1].src = url + '.png';
        }
    };
    
};

HexagonGrid.prototype.drawHexGrid = function (rows, cols, originX, originY, isDebug) {
    this.canvasOriginX = originX;
    this.canvasOriginY = originY;

    var currentHexX;
    var currentHexY;
    var debugText = "";

    var offsetColumn = false;

    for (var col = 0; col < cols; col++) {
        for (var row = 0; row < rows; row++) {

            if (!offsetColumn) {
                currentHexX = (col * this.side) + originX;
                currentHexY = (row * this.height) + originY;
            } else {
                currentHexX = col * this.side + originX;
                currentHexY = (row * this.height) + originY + (this.height * 0.5);
            }

            if (isDebug) {
                debugText = col + "," + row;
            }

            this.drawHex(currentHexX, currentHexY, "#ddd", debugText);
        }
        offsetColumn = !offsetColumn;
    }
};

HexagonGrid.prototype.drawHexAtColRow = function(column, row, color, line) {
    var drawy = column % 2 == 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2);
    var drawx = (column * this.side) + this.canvasOriginX;

    if (line){
       this.drawHexLine(drawx, drawy, color, "");
    }
    else{
       this.drawHex(drawx, drawy, color, "");
    }
};

function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}


HexagonGrid.prototype.drawHexLine = function(x0, y0, fillColor, debugText) {
    this.context.strokeStyle = ColorLuminance(fillColor, -0.5);
    this.context.beginPath();
    this.context.moveTo(x0 + this.width - this.side, y0);
    this.context.lineTo(x0 + this.side, y0);
    this.context.lineTo(x0 + this.width, y0 + (this.height / 2));
    this.context.lineTo(x0 + this.side, y0 + this.height);
    this.context.lineTo(x0 + this.width - this.side, y0 + this.height);
    this.context.lineTo(x0, y0 + (this.height / 2));
    this.context.closePath();
    this.context.stroke();
};

HexagonGrid.prototype.drawHex = function(x0, y0, fillColor, debugText) {
    this.context.strokeStyle = ColorLuminance(fillColor, -0.5);
    this.context.beginPath();
    this.context.moveTo(x0 + this.width - this.side, y0);
    this.context.lineTo(x0 + this.side, y0);
    this.context.lineTo(x0 + this.width, y0 + (this.height / 2));
    this.context.lineTo(x0 + this.side, y0 + this.height);
    this.context.lineTo(x0 + this.width - this.side, y0 + this.height);
    this.context.lineTo(x0, y0 + (this.height / 2));

    if (fillColor) {
        this.context.fillStyle = fillColor;
        this.context.fill();
    }

    this.context.closePath();
    this.context.stroke();

    if (debugText) {
        this.context.font = "8px";
        this.context.fillStyle = "#000";
        this.context.fillText(debugText, x0 + (this.width / 2) - (this.width/4), y0 + (this.height - 5));
    }
};

//Recusivly step up to the body to calculate canvas offset.
HexagonGrid.prototype.getRelativeCanvasOffset = function() {
   var x = 0, y = 0;
   var layoutElement = this.canvas;
    if (layoutElement.offsetParent) {
        do {
            x += layoutElement.offsetLeft;
            y += layoutElement.offsetTop;
        } while (layoutElement = layoutElement.offsetParent);

        return { x: x, y: y };
    }
}

//Uses a grid overlay algorithm to determine hexagon location
//Left edge of grid has a test to acuratly determin correct hex
HexagonGrid.prototype.getSelectedTile = function(mouseX, mouseY, ratio) {

   var offSet = this.getRelativeCanvasOffset();

    mouseX -= offSet.x;
    mouseY -= offSet.y;

    mouseX *= ratio;
    mouseY *= ratio;

    var column = Math.floor((mouseX) / this.side);
    var row = Math.floor(
        column % 2 == 0
            ? Math.floor((mouseY) / this.height)
            : Math.floor(((mouseY + (this.height * 0.5)) / this.height)) - 1);


    //Test if on left side of frame
    if (mouseX > (column * this.side) && mouseX < (column * this.side) + this.width - this.side) {


        //Now test which of the two triangles we are in
        //Top left triangle points
        var p1 = new Object();
        p1.x = column * this.side;
        p1.y = column % 2 == 0
            ? row * this.height
            : (row * this.height) + (this.height / 2);

        var p2 = new Object();
        p2.x = p1.x;
        p2.y = p1.y + (this.height / 2);

        var p3 = new Object();
        p3.x = p1.x + this.width - this.side;
        p3.y = p1.y;

        var mousePoint = new Object();
        mousePoint.x = mouseX;
        mousePoint.y = mouseY;

        if (this.isPointInTriangle(mousePoint, p1, p2, p3)) {
            column--;

            if (column % 2 != 0) {
                row--;
            }
        }

        //Bottom left triangle points
        var p4 = new Object();
        p4 = p2;

        var p5 = new Object();
        p5.x = p4.x;
        p5.y = p4.y + (this.height / 2);

        var p6 = new Object();
        p6.x = p5.x + (this.width - this.side);
        p6.y = p5.y;

        if (this.isPointInTriangle(mousePoint, p4, p5, p6)) {
            column--;

            if (column % 2 == 0) {
                row++;
            }
        }
    }

    return  {row: row, column: column };
};


HexagonGrid.prototype.sign = function(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
};

//TODO: Replace with optimized barycentric coordinate method
HexagonGrid.prototype.isPointInTriangle = function isPointInTriangle(pt, v1, v2, v3) {
    var b1, b2, b3;

    b1 = this.sign(pt, v1, v2) < 0.0;
    b2 = this.sign(pt, v2, v3) < 0.0;
    b3 = this.sign(pt, v3, v1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
};

HexagonGrid.prototype.doesTileExist = function doesTileExist(tile){
    var res = -1;
    for (var i in this.hexList){
       this.hexList[i].isActive = false;
       if (this.hexList[i].row == tile.row && this.hexList[i].column == tile.column){
          this.hexList[i].isActive = true;
          res = i;
       }
    }
    return res;
}

HexagonGrid.prototype.repaint = function repaint(){
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    for (var i in this.hexList){
      this.drawHexAtColRow(this.hexList[i].column, this.hexList[i].row, this.hexList[i].color);

      var tile = this.hexList[i];
      var drawy = tile.column % 2 == 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
      var drawx = (tile.column * this.side) + this.canvasOriginX;
      this.context.drawImage(this.images[i], drawx, drawy-6, this.width, this.height); 
    }
}

HexagonGrid.prototype.clickEvent = function (e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;

    var localX = mouseX - this.canvasOriginX;
    var localY = mouseY - this.canvasOriginY;

    var ratio = this.canvas.width / parseInt($(this.canvas).css("width"))

    var tile = this.getSelectedTile(localX, localY, ratio);
    tileIndex = this.doesTileExist(tile);

    if (tileIndex != -1) {
        $('html, body').animate({
		scrollTop: $('#'+this.urls[tileIndex]).offset().top - 150
	}, 500);
    }
};

HexagonGrid.prototype.mouseOverEvent = function (e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;

    var localX = mouseX - this.canvasOriginX;
    var localY = mouseY - this.canvasOriginY;

    var ratio = this.canvas.width / parseInt($(this.canvas).css("width"))

    var tile = this.getSelectedTile(localX, localY, ratio);
    this.repaint();
    var whichTile = this.doesTileExist(tile);
    if (whichTile != -1) {
       if (tile.column >= 0 && tile.row >= 0) {
           var drawy = tile.column % 2 == 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
           var drawx = (tile.column * this.side) + this.canvasOriginX;

           this.drawHex(drawx, drawy - 6, ColorLuminance(this.hexList[whichTile].color, 0.2), ''); //"rgba(110,110,70,0.3)", "");
           this.context.drawImage(this.images[whichTile], drawx, drawy-6, this.width, this.height); 
           this.context.drawImage(base_image, drawx, drawy-6, this.width, this.height); 
       }
    }
    for (var i in this.hexList){
      this.drawHexAtColRow(this.hexList[i].column, this.hexList[i].row, this.hexList[i].color, true);
    }
    
};

