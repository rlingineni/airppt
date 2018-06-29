/*
    Set the Local Grid Size
*/
import { Plane, Coordinate } from "./models/gridscaler";

class GridScaler {
  private plane: Plane;
  private gridSize = 16;
  private scaleFactor = 96 / 914400; //default scale converts EMU to pixel

  constructor(
    initX: number,
    initY: number,
    numColumns: number,
    scaleFactorVal?: number
  ) {
    this.scaleFactor = scaleFactorVal || this.scaleFactor; // override the default scale value

    this.plane = {
      width: initX * this.scaleFactor,
      height: initY * this.scaleFactor
    };

    this.gridSize = numColumns; //To-Do: Update this as num columns
  }

  public getNewPlaneSize() {
    return this.plane;
  }

  /**
   *
   * @param {*} coordinate
   */
  public getScaledCoordinate(coordinate: Coordinate) {
    return {
      x: coordinate.x * this.scaleFactor,
      y: coordinate.y * this.scaleFactor
    };
  }

  public getScaledValue(val) {
    return val * this.scaleFactor;
  }
  getElementGridPlacement(origin: Coordinate, offset: Coordinate) {
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
      "grid-row": rowRange,
      "grid-column": columnRange
    };
  }
}

export default GridScaler;
