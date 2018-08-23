import GridScaler from "gridscalerts";
import { PowerpointElement } from "@models/pptelement";
import { PositionType } from "@models/css";
import * as jsdom from "jsdom";
import * as jquery from "jquery";

const beautify = require("beautify");

/**
 * Every Shape that is implemented must extend this renderer
 */
abstract class ElementRenderer {
	protected elementCSS = [];
	protected $ = jquery(new jsdom.JSDOM().window);

	constructor(
		protected scaler: GridScaler,
		protected element: PowerpointElement,
		protected rawSlideShowGlobals,
		protected rawSlideShowTheme,
		positionType: PositionType
	) {
		if (positionType == PositionType.Absolute) {
			this.generateElementAbsolutePosition();
		} else {
			this.generateElementGridPosition();
		}
	}

	public getCSS(): string {
		return beautify(this.elementCSS.join(""), { format: "css" });
	}

	public abstract render(): string;

	private generateElementAbsolutePosition() {
		let scaledPositionCoordinates = this.scaler.getScaledCoordinate({
			x: this.element.elementPosition.x,
			y: this.element.elementPosition.y
		});
		let cssPosition = {
			position: "absolute",
			top: scaledPositionCoordinates.y + "px",
			left: scaledPositionCoordinates.x + "px"
		};
		let elementStyleKey = "#" + this.element.name + ".position";
		let layoutStyle = {};
		layoutStyle[elementStyleKey] = cssPosition;
		let css = this.generateCSSfromObject(layoutStyle);
		this.elementCSS.push(css);
		return css;
	}

	private generateElementGridPosition() {
		let cssPosition = this.scaler.getElementGridPlacement(
			{
				x: this.element.elementPosition.x,
				y: this.element.elementPosition.y
			},
			{
				x: this.element.elementOffsetPosition.cx,
				y: this.element.elementOffsetPosition.cy
			}
		);
		let elementStyleKey = "#" + this.element.name + ".position";
		let layoutStyle = {};
		layoutStyle[elementStyleKey] = cssPosition;
		let css = this.generateCSSfromObject(layoutStyle);
		this.elementCSS.push(css);
		return css;
	}

	protected generateCSSfromObject(obj: any) {
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

	protected getOutputImagePath(tiffPath) {
		let imagePath = tiffPath.replace("ppt", "assets");
		let fileExtension = tiffPath.split(".").pop();
		if (fileExtension == "tiff") {
			imagePath = imagePath.replace(".tiff", ".png"); //tiffs are converted to pngs, so use the new filepath
		}

		return imagePath;
	}
	protected addCSSAttribute(css: string): void {
		this.elementCSS.push(css); //add the new css object
	}
}

export default ElementRenderer;
