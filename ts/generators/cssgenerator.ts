import { PositionType } from "@models/css";

/**
 * Generates CSS Layout and Item Placement Classes as Per Slide
 */

const beautify = require("beautify");

class CSSGenerator {
	static gridCSS = [];
	static absoluteCSS = [];

	public static generateCSS(posType: PositionType, cssElements: string[]) {
		let css = "";
		if (posType == PositionType.Absolute) {
			this.absoluteCSS.push(`.wrapper {
            position: fixed;
            width: 1280px;
            height: 720px;
            border-color: #000000;
            border-style: dotted
		  }`);
			this.absoluteCSS = this.absoluteCSS.concat(cssElements);
			css = beautify(this.absoluteCSS.join(""), { format: "css" });
		} else {
			css = beautify(this.gridCSS.join(""), { format: "css" });
		}
		return css;
	}
}

export default CSSGenerator;
