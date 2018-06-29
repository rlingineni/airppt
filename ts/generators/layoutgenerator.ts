import GridScaler from "../gridscalerts";
import { PowerpointElement } from "../models/pptelement";
import * as ShapeRenderers from "@renderers/shapes";
import PowerpointElementParser from "elementparser";
/**
 * Generates CSS Layout and Item Placement Classes as Per Slide
 */

const beautify = require("beautify");

class LayoutGenerator {
	private gridCSS = [];
	private absoluteCSS = [];
	private slideShowGlobals;
	private slideShowTheme;

	constructor(slideShowGlobals, slideShowTheme) {
		this.slideShowGlobals = slideShowGlobals;
		this.slideShowTheme = slideShowTheme;
	}

	private generateCSS(obj: any) {
		const selectors = Object.keys(obj);
		let css = selectors
			.map(selector => {
				const definition = obj[selector];
				const rules = Object.keys(definition)
					.map(rule => `${rule}:${definition[rule]}`)
					.join(";");
				return `${selector} {${rules}}`;
			})
			.join("");
		return css;
	}

	public getCSS(posType) {
		let css = "";
		if (posType != "grid") {
			this.absoluteCSS.push(`.wrapper {
            position: fixed;
            width: 1280px;
            height: 720px;
            border-color: #000000;
            border-style: dotted
          }`);
			css = beautify(this.absoluteCSS.join(""), { format: "css" });
		} else {
			css = beautify(this.gridCSS.join(""), { format: "css" });
		}
		return css;
	}

	public generateElementLayoutCSS(scaler: GridScaler, element: PowerpointElement) {
		this.generateAbsoluteCSS(scaler, element);
		this.generateGridCSS(scaler, element);
		this.generateShapeCSS(scaler, element);
		return { absCSS: this.absoluteCSS, gridCSS: this.gridCSS };
	}

	private generateShapeCSS(scaler, element: PowerpointElement) {
		let css = ShapeRenderers[element.shapeType](scaler, element, this.slideShowGlobals, this.slideShowTheme);
		this.absoluteCSS.push(css);
		this.gridCSS.push(css);
	}

	private generateParagraphCSS(element: PowerpointElement) {}

	private generateAbsoluteCSS(scaler: GridScaler, element: PowerpointElement) {
		let planeSize = scaler.getNewPlaneSize();
		let scaledPositionCoordinates = scaler.getScaledCoordinate({
			x: element.elementPosition.x,
			y: element.elementPosition.y
		});
		let cssPosition = {
			position: "absolute",
			top: scaledPositionCoordinates.y + "px",
			left: scaledPositionCoordinates.x + "px"
		};
		let elementStyleKey = "#" + element.name + ".position";
		let layoutStyle = {};
		layoutStyle[elementStyleKey] = cssPosition;
		let css = this.generateCSS(layoutStyle);
		this.absoluteCSS.push(css);
		return css;
	}
	private generateGridCSS(scaler: GridScaler, element: PowerpointElement) {
		let cssPosition = scaler.getElementGridPlacement(
			{
				x: element.elementPosition.x,
				y: element.elementPosition.y
			},
			{
				x: element.elementOffsetPosition.cx,
				y: element.elementOffsetPosition.cy
			}
		);
		let elementStyleKey = "#" + element.name + ".position";
		let layoutStyle = {};
		layoutStyle[elementStyleKey] = cssPosition;
		let css = this.generateCSS(layoutStyle);
		this.gridCSS.push(css);
		return css;
	}
}

export default LayoutGenerator;
