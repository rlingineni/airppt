"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GridScaler {
    constructor(initX, initY, numColumns, scaleFactorVal) {
        this.gridSize = 16;
        this.scaleFactor = 96 / 914400; //default scale converts EMU to pixel
        this.scaleFactor = scaleFactorVal || this.scaleFactor; // override the default scale value
        this.plane = {
            width: initX * this.scaleFactor,
            height: initY * this.scaleFactor
        };
        this.gridSize = numColumns; //To-Do: Update this as num columns
    }
    getNewPlaneSize() {
        return this.plane;
    }
    /**
     *
     * @param {*} coordinate
     */
    getScaledCoordinate(coordinate) {
        return {
            x: coordinate.x * this.scaleFactor,
            y: coordinate.y * this.scaleFactor
        };
    }
    getScaledValue(val) {
        return val * this.scaleFactor;
    }
    getElementGridPlacement(origin, offset) {
        let cellWidth = Math.floor(this.plane.width / this.gridSize);
        let cellHeight = Math.floor(this.plane.height / this.gridSize);
        //update vals to be scaled
        let elementOrigin = this.getScaledCoordinate(origin);
        let elementOffset = this.getScaledCoordinate(offset);
        let beginColumn = Math.ceil(elementOrigin.x / cellWidth);
        let beginRow = Math.ceil(elementOrigin.y / cellHeight);
        let endColumn = Math.ceil((elementOrigin.x + elementOffset.x) / cellWidth);
        let endRow = Math.ceil((elementOrigin.y + elementOffset.y) / cellHeight);
        let columnRange = beginColumn + " / " + endColumn;
        let rowRange = beginRow + " / " + endRow;
        //assuming there is no range
        if (beginColumn == endColumn) {
            columnRange = beginColumn.toString();
        }
        if (beginRow == endRow) {
            rowRange = beginRow.toString();
        }
        return {
            'grid-row': rowRange,
            'grid-column': columnRange
        };
    }
}
exports.default = GridScaler;
