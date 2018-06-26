/*
    Set the Local Grid Size
*/
let window = {
    width: 256,
    height: 256
}

let gridSize = 16;
let scaleFactor = 96 / 914400; //default scale converts EMU to pixel

module.exports = GridScaler;


function GridScaler(initX, initY, numColumns, scaleFactorVal) {
    scaleFactor = scaleFactorVal || scaleFactor; // override the default scale value

    window = {
        width: initX * scaleFactor,
        height: initY * scaleFactor
    };

    gridSize = numColumns; //To-Do: Upadte this as num columns

}

GridScaler.prototype.getNewPlaneSize = function () {
    return window;
}
GridScaler.prototype.getScaledCoordinate = function (coordinate) {
    return {
        x: coordinate.x * scaleFactor,
        y: coordinate.y * scaleFactor
    };
}

GridScaler.prototype.getScaledValue = function (val) {
    return val * scaleFactor;
}
GridScaler.prototype.getElementGridPlacement = function (origin, offset) {

    let cellWidth = Math.floor(window.width / gridSize);
    let cellHeight = Math.floor(window.height / gridSize);

    //update vals to be scaled
    let elementOrigin = this.getScaledCoordinate(origin);
    let elementOffset = this.getScaledCoordinate(offset);

    let beginColumn = Math.ceil(elementOrigin.x / cellWidth);
    let beginRow = Math.ceil(elementOrigin.y / cellHeight);

    let endColumn = Math.ceil((elementOrigin.x + elementOffset.x) / cellWidth);
    let endRow = Math.ceil((elementOrigin.y + elementOffset.y) / cellHeight);

    let columnRange = beginColumn + " / " + endColumn;
    let rowRange = beginRow + " / " + endRow;

    if (beginColumn == endColumn) {
        columnRange = beginColumn
    }

    if (beginRow == endRow) {
        rowRange = beginRow
    }

    console.log(columnRange, rowRange);

    return {
        'grid-row': rowRange,
        'grid-column': columnRange
    }



}