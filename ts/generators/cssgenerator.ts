import { PositionType } from "@models/css";

/**
 * Generates CSS Layout and Item Placement Classes as Per Slide
 */

const beautify = require("beautify");

class CSSGenerator {
	static gridCSS = [];
	static absoluteCSS = [];

	public static generateCSS(posType: PositionType, cssElements: string[], absoluteSizeX?: number, absoluteSizeY?: number) {
		let css = "";
		if (posType == PositionType.Absolute) {
			this.absoluteCSS.push(
				`.wrapper {
            position: fixed;
            width:` +
					absoluteSizeX +
					`px;
            height:` +
					absoluteSizeY +
					`px;
            border-color: #000000;
            border-style: dotted
		  }`
			);
			this.absoluteCSS = this.absoluteCSS.concat(cssElements);
			css = beautify(this.absoluteCSS.join(""), { format: "css" });
		} else {
			this.gridCSS.push(`
			.wrapper {
				display: grid;
				grid-template-columns: repeat(12, 1fr);
				grid-gap: 10px;
				grid-auto-rows: minmax(80px, auto);
				width: 100vw;
			  }`);
			this.gridCSS = this.gridCSS.concat(cssElements);
			css = beautify(this.gridCSS.join(""), { format: "css" });
		}
		return css;
	}
}

export default CSSGenerator;
